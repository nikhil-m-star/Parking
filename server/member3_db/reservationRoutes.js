const express = require('express');
const router = express.Router();
const { verifyToken } = require('./authMiddleware');
const {
  sql,
  getUserReservations,
  createReservation,
  endReservation
} = require('./db');

// Get user's reservations (Protected)
router.get('/', verifyToken, async (req, res) => {
  try {
    const reservations = await getUserReservations(req.userId);
    res.json(reservations);
  } catch (error) {
    console.error('Fetch reservations error:', error);
    res.status(500).json({ message: 'Failed to fetch reservations', error: error.message });
  }
});

// Create a new reservation (Protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { slotId, vehiclePlate } = req.body;

    if (!slotId || !vehiclePlate) {
      return res.status(400).json({ message: 'Slot ID and vehicle plate are required' });
    }

    // Check if slot exists and is free
    const slot = await sql`SELECT * FROM parking_slots WHERE id = ${slotId}`;
    if (slot.length === 0) {
      return res.status(404).json({ message: 'Parking slot not found' });
    }

    if (slot[0].status !== 'free') {
      return res.status(409).json({ message: 'Parking slot is not available' });
    }

    // Create reservation
    const reservation = await createReservation(req.userId, slotId, vehiclePlate);

    res.status(201).json({
      message: 'Reservation created successfully',
      reservation
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({ message: 'Failed to create reservation', error: error.message });
  }
});

// End a reservation (Protected)
router.put('/:reservationId/end', verifyToken, async (req, res) => {
  try {
    const { reservationId } = req.params;

    // Get reservation
    const reservation = await sql`SELECT * FROM reservations WHERE id = ${reservationId}`;
    if (reservation.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation[0].user_id !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to end this reservation' });
    }

    // End reservation
    const updatedReservation = await endReservation(reservationId, reservation[0].slot_id);

    // Add to parking history
    const slotNumber = await sql`SELECT number FROM parking_slots WHERE id = ${reservation[0].slot_id}`;
    await sql`
      INSERT INTO parking_history (user_id, slot_number, vehicle_plate, check_in, check_out)
      VALUES (
        ${req.userId},
        ${slotNumber[0].number},
        ${reservation[0].vehicle_plate},
        ${reservation[0].check_in_time},
        CURRENT_TIMESTAMP
      )
    `;

    res.json({
      message: 'Reservation ended successfully',
      reservation: updatedReservation
    });
  } catch (error) {
    console.error('End reservation error:', error);
    res.status(500).json({ message: 'Failed to end reservation', error: error.message });
  }
});

// Cancel a reservation (Protected)
router.put('/:reservationId/cancel', verifyToken, async (req, res) => {
  try {
    const { reservationId } = req.params;

    // Get reservation
    const reservation = await sql`SELECT * FROM reservations WHERE id = ${reservationId}`;
    if (reservation.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation[0].user_id !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to cancel this reservation' });
    }

    if (reservation[0].status !== 'active') {
      return res.status(409).json({ message: 'Only active reservations can be cancelled' });
    }

    // Cancel reservation
    const result = await sql`
      UPDATE reservations
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${reservationId}
      RETURNING *
    `;

    // Free the parking slot
    await sql`UPDATE parking_slots SET status = 'free' WHERE id = ${reservation[0].slot_id}`;

    res.json({
      message: 'Reservation cancelled successfully',
      reservation: result[0]
    });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({ message: 'Failed to cancel reservation', error: error.message });
  }
});

// Get parking history (Protected)
router.get('/history/all', verifyToken, async (req, res) => {
  try {
    const history = await sql`
      SELECT * FROM parking_history
      WHERE user_id = ${req.userId}
      ORDER BY created_at DESC
    `;
    res.json(history);
  } catch (error) {
    console.error('Fetch history error:', error);
    res.status(500).json({ message: 'Failed to fetch history', error: error.message });
  }
});

module.exports = router;
