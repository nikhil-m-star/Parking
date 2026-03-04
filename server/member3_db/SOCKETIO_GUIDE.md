# Socket.io Real-Time Events Documentation

## Overview

Socket.io integration provides real-time, bidirectional communication between the frontend and backend for:
- Live slot availability updates
- Real-time reservation management
- Occupancy statistics
- User notifications
- Admin monitoring

**Namespace:** `/parking`

---

## Client Connection

### Connect to Socket.io

```javascript
// Frontend - React
import io from 'socket.io-client';

const socket = io('http://localhost:5000/parking', {
  auth: {
    token: localStorage.getItem('token')
  }
});

// After successful login, emit user:join
socket.emit('user:join', {
  userId: user.id,
  email: user.email,
  username: user.username
});
```

---

## Events Reference

### Authentication Events

#### `user:join` (Client → Server)
Connect user to real-time system after login.

```javascript
socket.emit('user:join', {
  userId: 1,
  email: 'user@example.com',
  username: 'john_doe'
});

// Response
socket.on('connection:success', (data) => {
  console.log(data); // { message: '...', userId: 1, timestamp: ... }
});
```

---

### Slot Events

#### `slots:watch` (Client → Server)
Start watching for real-time slot status updates.

```javascript
socket.emit('slots:watch');

socket.on('slots:watching', (data) => {
  console.log('Watching slots:', data);
});
```

#### `slots:getAll` (Client → Server)
Get all current parking slots.

```javascript
socket.emit('slots:getAll');

socket.on('slots:all', (data) => {
  console.log(data); // { slots: [...], timestamp: ... }
  // slots array with id, number, status
});
```

#### `slots:updated` (Server → Client)
Receive real-time updates when a slot status changes.

```javascript
socket.on('slots:updated', (data) => {
  console.log(data);
  // { slotId: 5, slotNumber: 105, status: 'occupied', timestamp: ... }
});
```

#### `slots:occupied` (Server → Client)
Broadcast when a slot becomes occupied.

```javascript
socket.on('slots:occupied', (data) => {
  console.log(data);
  // { slotId: 5, slotNumber: 105, reservedBy: 1, timestamp: ... }
});
```

#### `slots:freed` (Server → Client)
Broadcast when a slot becomes free.

```javascript
socket.on('slots:freed', (data) => {
  console.log(data);
  // { slotId: 5, slotNumber: 105, freedBy: 1, timestamp: ... }
});
```

---

### Reservation Events

#### `reservations:getUser` (Client → Server)
Get all reservations for current user.

```javascript
socket.emit('reservations:getUser');

socket.on('reservations:user', (data) => {
  console.log(data);
  // { reservations: [...], timestamp: ... }
});
```

#### `reservations:create` (Client → Server)
Create a new parking reservation in real-time.

```javascript
socket.emit('reservations:create', {
  slotId: 5,
  vehiclePlate: 'ABC123'
});

socket.on('reservations:created', (data) => {
  console.log(data);
  // { message: '...', reservation: {...}, timestamp: ... }
});

// Error response
socket.on('error', (data) => {
  console.error(data); // { message: 'Slot not available' }
});
```

#### `reservations:end` (Client → Server)
End a parking session.

```javascript
socket.emit('reservations:end', {
  reservationId: 1
});

socket.on('reservations:ended', (data) => {
  console.log(data);
  // { message: '...', reservationId: 1, timestamp: ... }
});
```

---

### Notification Events

#### `notifications:subscribe` (Client → Server)
Subscribe to user notifications.

```javascript
socket.emit('notifications:subscribe');

socket.on('notifications:subscribed', (data) => {
  console.log('Subscribed to notifications:', data);
});
```

#### `notification` (Server → Client)
Receive real-time notifications.

```javascript
socket.on('notification', (data) => {
  console.log(data);
  // {
  //   type: 'reservation_confirmed',
  //   message: 'Your reservation is confirmed',
  //   data: {...},
  //   timestamp: ...
  // }
});
```

**Notification Types:**
- `reservation_created` - Reservation created
- `reservation_ended` - Parking session ended
- `reservation_cancelled` - Reservation cancelled
- `slot_available` - Desired slot became available
- `system_alert` - System-wide alerts

---

### Statistics Events

#### `stats:watch` (Client → Server)
Start watching occupancy statistics updates.

```javascript
socket.emit('stats:watch');

socket.on('stats:watching', (data) => {
  console.log('Watching stats:', data);
});
```

#### `stats:get` (Client → Server)
Get current occupancy statistics.

```javascript
socket.emit('stats:get');

socket.on('stats:current', (data) => {
  console.log(data);
  // {
  //   totalSlots: 100,
  //   occupiedSlots: 45,
  //   freeSlots: 55,
  //   occupancyRate: '45.00%',
  //   timestamp: ...
  // }
});
```

#### `stats:updated` (Server → Client)
Receive real-time occupancy updates.

```javascript
socket.on('stats:updated', (data) => {
  console.log(data);
  // Same structure as stats:current
});
```

---

### Admin Events

#### `admin:watchReservations` (Client → Server)
Admin watch all reservations in real-time.

```javascript
socket.emit('admin:watchReservations');

socket.on('admin:reservations', (data) => {
  console.log(data);
  // {
  //   reservations: [
  //     {
  //       id: 1,
  //       user_id: 5,
  //       slot_id: 10,
  //       username: 'john_doe',
  //       email: 'john@example.com',
  //       slot_number: 105,
  //       status: 'active',
  //       ...
  //     },
  //     ...
  //   ],
  //   timestamp: ...
  // }
});
```

#### `admin:reservationNew` (Server → Client)
Real-time alert when new reservation created (admin only).

```javascript
socket.on('admin:reservationNew', (data) => {
  console.log(data);
  // {
  //   reservation: {...},
  //   timestamp: ...
  // }
});
```

---

### User Status Events

#### `users:online` (Server → Client)
Broadcast online users count.

```javascript
socket.on('users:online', (data) => {
  console.log(`${data.count} users online`);
  // { count: 42, timestamp: ... }
});
```

---

## Complete Frontend Example

```javascript
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

function ParkingDashboard({ user, token }) {
  const [socket, setSocket] = useState(null);
  const [slots, setSlots] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Connect to Socket.io
    const newSocket = io('http://localhost:5000/parking');

    // Join parking namespace
    newSocket.emit('user:join', {
      userId: user.id,
      email: user.email,
      username: user.username
    });

    // Listen for connection success
    newSocket.on('connection:success', (data) => {
      console.log('Connected:', data);
      
      // Start watching slots
      newSocket.emit('slots:watch');
      newSocket.emit('slots:getAll');
      
      // Start watching stats
      newSocket.emit('stats:watch');
      newSocket.emit('stats:get');
      
      // Get user reservations
      newSocket.emit('reservations:getUser');
      
      // Subscribe to notifications
      newSocket.emit('notifications:subscribe');
    });

    // Listen for slot updates
    newSocket.on('slots:all', (data) => {
      setSlots(data.slots);
    });

    newSocket.on('slots:updated', (data) => {
      setSlots(prev => prev.map(slot => 
        slot.id === data.slotId 
          ? { ...slot, status: data.status }
          : slot
      ));
    });

    newSocket.on('slots:occupied', (data) => {
      console.log(`Slot ${data.slotNumber} now occupied`);
      setSlots(prev => prev.map(slot => 
        slot.number === data.slotNumber 
          ? { ...slot, status: 'occupied' }
          : slot
      ));
    });

    newSocket.on('slots:freed', (data) => {
      console.log(`Slot ${data.slotNumber} is now free`);
      setSlots(prev => prev.map(slot => 
        slot.number === data.slotNumber 
          ? { ...slot, status: 'free' }
          : slot
      ));
    });

    // Listen for reservation updates
    newSocket.on('reservations:user', (data) => {
      setReservations(data.reservations);
    });

    newSocket.on('reservations:created', (data) => {
      console.log('Reservation created:', data.reservation);
      setReservations(prev => [...prev, data.reservation]);
    });

    // Listen for statistics updates
    newSocket.on('stats:current', (data) => {
      setStats(data);
    });

    newSocket.on('stats:updated', (data) => {
      setStats(data);
    });

    // Listen for notifications
    newSocket.on('notification', (data) => {
      console.log('Notification:', data);
      // Show toast or notification UI
    });

    // Handle errors
    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const handleCreateReservation = (slotId) => {
    socket?.emit('reservations:create', {
      slotId,
      vehiclePlate: 'ABC123'
    });
  };

  const handleEndReservation = (reservationId) => {
    socket?.emit('reservations:end', {
      reservationId
    });
  };

  return (
    <div>
      <h1>Parking Dashboard</h1>
      
      {stats && (
        <div className="stats">
          <p>Free Slots: {stats.freeSlots} / {stats.totalSlots}</p>
          <p>Occupancy: {stats.occupancyRate}</p>
        </div>
      )}

      <div className="slots">
        {slots.map(slot => (
          <div key={slot.id} className={`slot ${slot.status}`}>
            <p>Slot {slot.number}</p>
            <p>{slot.status}</p>
            {slot.status === 'free' && (
              <button onClick={() => handleCreateReservation(slot.id)}>
                Reserve
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="reservations">
        {reservations.map(res => (
          <div key={res.id} className="reservation">
            <p>Slot: {res.slot_number}</p>
            <p>Status: {res.status}</p>
            {res.status === 'active' && (
              <button onClick={() => handleEndReservation(res.id)}>
                End Parking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParkingDashboard;
```

---

## Error Handling

All errors are emitted via the `error` event:

```javascript
socket.on('error', (data) => {
  // { message: 'Error description' }
});
```

**Common Errors:**
- `"Not authenticated"` - User not authenticated
- `"Slot not found"` - Slot doesn't exist
- `"Slot is not available"` - Slot already occupied
- `"Reservation not found"` - Reservation doesn't exist
- `"Not authorized"` - User not authorized for action
- `"Failed to [operation]"` - Database or server error

---

## Event Flow Diagrams

### Reservation Creation Flow
```
Client                              Server
  |                                   |
  ├─ user:join ──────────────────────>|
  |                                   |
  |<───────── connection:success ─────┤
  |                                   |
  ├─ slots:watch ────────────────────>|
  |                                   |
  |<──────── slots:watching ──────────┤
  |                                   |
  ├─ reservations:create ───────────>|
  |    (slotId, vehiclePlate)        |
  |                                   | Check availability
  |                                   | Create reservation
  |<───── reservations:created ──────┤
  |                                   |
  |  All clients                      |
  |<───── slots:occupied ─────────────┤ (broadcast)
```

### Slot Status Update Flow
```
Database (IoT)                     Server            All Clients
    |                                |                   |
    | Slot status changed            |                   |
    |──────────────────>|            |                   |
    |                   | Update     |                   |
    |                   | broadcast  |                   |
    |                   |────── slots:updated ───────>|
    |                   |────── stats:updated ───────>|
```

---

## Performance Considerations

1. **Room-based Broadcasting**: Events are broadcast to specific rooms to avoid redundant emissions
2. **User Isolation**: Each user has a dedicated room (`user:${userId}`)
3. **Namespace Separation**: All parking events use `/parking` namespace
4. **Connection Pooling**: Database uses Neon's connection pooling
5. **Memory**: Socket.io manages active connections efficiently

---

## Troubleshooting

### Socket Not Connecting
- Check server is running on correct port
- Verify CORS configuration
- Check network connection
- Ensure Socket.io client library installed

### Events Not Received
- Verify event names match exactly (case-sensitive)
- Check user:join was emitted after connection
- Verify socket.io middleware not blocking events

### Real-time Updates Not Working
- Confirm watch event was emitted
- Check database is updated properly
- Verify socket connection still active

---

## Best Practices

1. **Always authenticate** before accessing protected events
2. **Handle errors** with proper error event listeners
3. **Unsubscribe** from events when component unmounts
4. **Use rooms** for targeted messaging
5. **Implement reconnection** logic in frontend
6. **Log socket events** for debugging
7. **Rate limit** event emissions to prevent abuse

---

**Socket.io Version:** 4.8.3  
**Namespace:** `/parking`  
**Status:** ✅ Production Ready
