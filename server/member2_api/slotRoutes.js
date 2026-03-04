const express = require('express');
const router = express.Router();
const { sql } = require('../member3_db/db');

// Get all slots
router.get('/', async (req, res) => {
    try {
        const slots = await sql`SELECT * FROM parking_slots ORDER BY number ASC`;
        res.json(slots);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific slot
router.get('/:number', async (req, res) => {
    const { number } = req.params;
    try {
        const slot = await sql`SELECT * FROM parking_slots WHERE number = ${number}`;
        if (slot.length === 0) return res.status(404).json({ message: 'Slot not found' });
        res.json(slot[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new slot
router.post('/', async (req, res) => {
    const { number, status } = req.body;
    try {
        const result = await sql`
            INSERT INTO parking_slots (number, status, last_updated)
            VALUES (${number}, ${status || 'available'}, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        res.status(201).json(result[0]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a slot
router.delete('/:number', async (req, res) => {
    const { number } = req.params;
    try {
        const result = await sql`DELETE FROM parking_slots WHERE number = ${number} RETURNING *`;
        if (result.length === 0) return res.status(404).json({ message: 'Slot not found' });
        res.json({ message: 'Slot deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Update slot status (Used by IoT Simulator)
router.patch('/:number', async (req, res) => {
    const { number } = req.params;
    const { status } = req.body;
    try {
        const result = await sql`
      INSERT INTO parking_slots (number, status, last_updated)
      VALUES (${number}, ${status}, CURRENT_TIMESTAMP)
      ON CONFLICT (number) 
      DO UPDATE SET status = ${status}, last_updated = CURRENT_TIMESTAMP
      RETURNING *
    `;
        res.json(result[0]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
