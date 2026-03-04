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
