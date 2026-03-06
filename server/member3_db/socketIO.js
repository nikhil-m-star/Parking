const { sql, getUserReservations, createReservation, endReservation } = require('./db');

// Store active users and their socket connections
const activeUsers = new Map();
const socketToUser = new Map();

module.exports = function configureSocketIO(io) {
  // Namespace for parking events
  const parkingNamespace = io.of('/parking');

  parkingNamespace.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    // ==================== AUTHENTICATION ====================
    
    /**
     * User joins - establish connection with user ID
     * Emitted from: Frontend after login
     */
    socket.on('user:join', async (data) => {
      try {
        const { userId, email, username } = data;
        
        if (!userId) {
          socket.emit('error', { message: 'User ID is required' });
          return;
        }

        // Store mapping
        activeUsers.set(userId, socket.id);
        socketToUser.set(socket.id, userId);
        socket.userId = userId;

        // Join user-specific room
        socket.join(`user:${userId}`);
        
        console.log(`[Socket] User ${userId} (${email}) joined parking namespace`);
        
        socket.emit('connection:success', {
          message: 'Connected to parking system',
          userId,
          timestamp: new Date()
        });

        // Broadcast online users count
        broadcastOnlineUsers(parkingNamespace);
      } catch (error) {
        console.error('[Socket] Error in user:join:', error);
        socket.emit('error', { message: 'Failed to join parking system' });
      }
    });

    // ==================== REAL-TIME SLOT UPDATES ====================

    /**
     * Get all slot availability - real-time
     * Emitted from: Frontend to get current slot status
     */
    socket.on('slots:getAll', async () => {
      try {
        const slots = await sql`SELECT * FROM parking_slots ORDER BY number ASC`;
        
        socket.emit('slots:all', {
          slots,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('[Socket] Error fetching slots:', error);
        socket.emit('error', { message: 'Failed to fetch slots' });
      }
    });

    /**
     * Watch slot status changes
     * Emitted from: Frontend to listen for slot updates
     */
    socket.on('slots:watch', (data) => {
      socket.join('slots:updates');
      socket.emit('slots:watching', {
        message: 'Now watching slot updates',
        timestamp: new Date()
      });
    });

    /**
     * Slot status changed - broadcast to all watchers
     * Emitted from: Backend when slot status changes
     */
    const broadcastSlotUpdate = (slotId, slotNumber, newStatus) => {
      parkingNamespace.to('slots:updates').emit('slots:updated', {
        slotId,
        slotNumber,
        status: newStatus,
        timestamp: new Date()
      });
    };
    socket.broadcastSlotUpdate = broadcastSlotUpdate;

    // ==================== RESERVATION EVENTS ====================

    /**
     * Get user's reservations - real-time
     * Emitted from: Frontend to fetch user's bookings
     */
    socket.on('reservations:getUser', async (data) => {
      try {
        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        const reservations = await getUserReservations(socket.userId);
        
        socket.emit('reservations:user', {
          reservations,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('[Socket] Error fetching user reservations:', error);
        socket.emit('error', { message: 'Failed to fetch reservations' });
      }
    });

    /**
     * Create reservation through Socket.io
     * Emitted from: Frontend when user books a slot
     */
    socket.on('reservations:create', async (data) => {
      try {
        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        const { slotId, vehiclePlate } = data;

        if (!slotId || !vehiclePlate) {
          socket.emit('error', { message: 'Slot ID and vehicle plate required' });
          return;
        }

        // Check slot availability
        const slot = await sql`SELECT * FROM parking_slots WHERE id = ${slotId}`;
        if (slot.length === 0) {
          socket.emit('error', { message: 'Slot not found' });
          return;
        }

        if (slot[0].status !== 'free') {
          socket.emit('error', { message: 'Slot is not available' });
          return;
        }

        // Create reservation
        const reservation = await createReservation(socket.userId, slotId, vehiclePlate);

        // Update slot status
        await sql`UPDATE parking_slots SET status = 'occupied' WHERE id = ${slotId}`;

        // Emit success to user
        socket.emit('reservations:created', {
          message: 'Reservation created successfully',
          reservation,
          timestamp: new Date()
        });

        // Broadcast slot update to all users
        parkingNamespace.emit('slots:occupied', {
          slotId,
          slotNumber: slot[0].number,
          reservedBy: socket.userId,
          timestamp: new Date()
        });

        console.log(`[Socket] Reservation created: User ${socket.userId}, Slot ${slotId}`);
      } catch (error) {
        console.error('[Socket] Error creating reservation:', error);
        socket.emit('error', { message: 'Failed to create reservation' });
      }
    });

    /**
     * End parking session through Socket.io
     * Emitted from: Frontend when user ends parking
     */
    socket.on('reservations:end', async (data) => {
      try {
        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        const { reservationId } = data;

        if (!reservationId) {
          socket.emit('error', { message: 'Reservation ID required' });
          return;
        }

        // Get reservation
        const reservation = await sql`SELECT * FROM reservations WHERE id = ${reservationId}`;
        
        if (reservation.length === 0) {
          socket.emit('error', { message: 'Reservation not found' });
          return;
        }

        if (reservation[0].user_id !== socket.userId) {
          socket.emit('error', { message: 'Not authorized' });
          return;
        }

        // End reservation
        await endReservation(reservationId, reservation[0].slot_id);

        // Update slot status back to free
        await sql`UPDATE parking_slots SET status = 'free' WHERE id = ${reservation[0].slot_id}`;

        // Add to parking history
        const slotNumber = await sql`SELECT number FROM parking_slots WHERE id = ${reservation[0].slot_id}`;
        await sql`
          INSERT INTO parking_history (user_id, slot_number, vehicle_plate, check_in, check_out)
          VALUES (
            ${socket.userId},
            ${slotNumber[0].number},
            ${reservation[0].vehicle_plate},
            ${reservation[0].check_in_time},
            CURRENT_TIMESTAMP
          )
        `;

        // Emit success to user
        socket.emit('reservations:ended', {
          message: 'Parking session ended',
          reservationId,
          timestamp: new Date()
        });

        // Broadcast slot freed to all users
        parkingNamespace.emit('slots:freed', {
          slotId: reservation[0].slot_id,
          slotNumber: slotNumber[0].number,
          freedBy: socket.userId,
          timestamp: new Date()
        });

        console.log(`[Socket] Reservation ended: User ${socket.userId}, Reservation ${reservationId}`);
      } catch (error) {
        console.error('[Socket] Error ending reservation:', error);
        socket.emit('error', { message: 'Failed to end reservation' });
      }
    });

    // ==================== REAL-TIME NOTIFICATIONS ====================

    /**
     * Watch for parking notifications
     * Emitted from: Frontend to receive real-time alerts
     */
    socket.on('notifications:subscribe', () => {
      socket.join(`notifications:${socket.userId}`);
      socket.emit('notifications:subscribed', {
        message: 'Subscribed to notifications',
        timestamp: new Date()
      });
    });

    /**
     * Send notification to user
     * Internal function for backend use
     */
    const notifyUser = (userId, type, message, data = {}) => {
      parkingNamespace.to(`notifications:${userId}`).emit('notification', {
        type,
        message,
        data,
        timestamp: new Date()
      });
    };
    socket.notifyUser = notifyUser;

    // ==================== OCCUPANCY & STATS ====================

    /**
     * Get real-time parking statistics
     * Emitted from: Frontend/Admin dashboard
     */
    socket.on('stats:get', async () => {
      try {
        const slots = await sql`SELECT * FROM parking_slots`;
        const totalSlots = slots.length;
        const occupiedSlots = slots.filter(s => s.status === 'occupied').length;
        const freeSlots = totalSlots - occupiedSlots;
        const occupancyRate = ((occupiedSlots / totalSlots) * 100).toFixed(2);

        socket.emit('stats:current', {
          totalSlots,
          occupiedSlots,
          freeSlots,
          occupancyRate: `${occupancyRate}%`,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('[Socket] Error fetching stats:', error);
        socket.emit('error', { message: 'Failed to fetch statistics' });
      }
    });

    /**
     * Watch occupancy changes
     * Emitted from: Frontend to monitor real-time changes
     */
    socket.on('stats:watch', () => {
      socket.join('stats:updates');
      socket.emit('stats:watching', {
        message: 'Watching occupancy updates',
        timestamp: new Date()
      });
    });

    /**
     * Broadcast occupancy update to all watchers
     * Called internally when slots change
     */
    const broadcastOccupancyUpdate = async () => {
      try {
        const slots = await sql`SELECT * FROM parking_slots`;
        const totalSlots = slots.length;
        const occupiedSlots = slots.filter(s => s.status === 'occupied').length;
        const freeSlots = totalSlots - occupiedSlots;
        const occupancyRate = ((occupiedSlots / totalSlots) * 100).toFixed(2);

        parkingNamespace.to('stats:updates').emit('stats:updated', {
          totalSlots,
          occupiedSlots,
          freeSlots,
          occupancyRate: `${occupancyRate}%`,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('[Socket] Error broadcasting occupancy:', error);
      }
    };
    socket.broadcastOccupancyUpdate = broadcastOccupancyUpdate;

    // ==================== ADMIN EVENTS ====================

    /**
     * Admin watch all reservations
     * Emitted from: Admin dashboard
     */
    socket.on('admin:watchReservations', async () => {
      try {
        socket.join('admin:reservations');
        
        const reservations = await sql`
          SELECT r.*, u.username, u.email, ps.number as slot_number
          FROM reservations r
          JOIN users u ON r.user_id = u.id
          JOIN parking_slots ps ON r.slot_id = ps.id
          ORDER BY r.created_at DESC
        `;

        socket.emit('admin:reservations', {
          reservations,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('[Socket] Error in admin:watchReservations:', error);
        socket.emit('error', { message: 'Failed to fetch reservations' });
      }
    });

    /**
     * Broadcast new reservation to admins
     * Called internally when reservation created
     */
    const notifyAdminNewReservation = async (reservationId) => {
      try {
        const reservation = await sql`
          SELECT r.*, u.username, u.email, ps.number as slot_number
          FROM reservations r
          JOIN users u ON r.user_id = u.id
          JOIN parking_slots ps ON r.slot_id = ps.id
          WHERE r.id = ${reservationId}
        `;

        parkingNamespace.to('admin:reservations').emit('admin:reservationNew', {
          reservation: reservation[0],
          timestamp: new Date()
        });
      } catch (error) {
        console.error('[Socket] Error notifying admins:', error);
      }
    };
    socket.notifyAdminNewReservation = notifyAdminNewReservation;

    // ==================== DISCONNECT ====================

    socket.on('disconnect', () => {
      const userId = socketToUser.get(socket.id);
      
      if (userId) {
        activeUsers.delete(userId);
        socketToUser.delete(socket.id);
        console.log(`[Socket] User ${userId} disconnected`);
        
        // Broadcast online users count
        broadcastOnlineUsers(parkingNamespace);
      } else {
        console.log(`[Socket] Socket ${socket.id} disconnected`);
      }
    });

    // ==================== ERROR HANDLING ====================

    socket.on('error', (error) => {
      console.error('[Socket] Error:', error);
    });
  });

  /**
   * Broadcast count of online users to all connected clients
   */
  function broadcastOnlineUsers(namespace) {
    const onlineCount = activeUsers.size;
    namespace.emit('users:online', {
      count: onlineCount,
      timestamp: new Date()
    });
  }

  // Export helper functions for use in routes
  return {
    broadcastSlotUpdate: (slotId, slotNumber, status) => {
      parkingNamespace.to('slots:updates').emit('slots:updated', {
        slotId,
        slotNumber,
        status,
        timestamp: new Date()
      });
    },
    
    broadcastOccupancyUpdate: async () => {
      try {
        const slots = await sql`SELECT * FROM parking_slots`;
        const totalSlots = slots.length;
        const occupiedSlots = slots.filter(s => s.status === 'occupied').length;
        const freeSlots = totalSlots - occupiedSlots;
        const occupancyRate = ((occupiedSlots / totalSlots) * 100).toFixed(2);

        parkingNamespace.to('stats:updates').emit('stats:updated', {
          totalSlots,
          occupiedSlots,
          freeSlots,
          occupancyRate: `${occupancyRate}%`,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('[Socket] Error broadcasting occupancy:', error);
      }
    },

    notifyUser: (userId, type, message, data) => {
      parkingNamespace.to(`notifications:${userId}`).emit('notification', {
        type,
        message,
        data,
        timestamp: new Date()
      });
    },

    notifyAdminNewReservation: async (reservationId) => {
      try {
        const reservation = await sql`
          SELECT r.*, u.username, u.email, ps.number as slot_number
          FROM reservations r
          JOIN users u ON r.user_id = u.id
          JOIN parking_slots ps ON r.slot_id = ps.id
          WHERE r.id = ${reservationId}
        `;

        parkingNamespace.to('admin:reservations').emit('admin:reservationNew', {
          reservation: reservation[0],
          timestamp: new Date()
        });
      } catch (error) {
        console.error('[Socket] Error notifying admins:', error);
      }
    },

    getActiveUsers: () => activeUsers.size
  };
};
