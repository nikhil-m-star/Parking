const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const sql = neon(process.env.DATABASE_URL);

// Function to initialize tables (Member 3 task)
async function initDb() {
    await sql`
    CREATE TABLE IF NOT EXISTS parking_slots (
      id SERIAL PRIMARY KEY,
      number INTEGER UNIQUE NOT NULL,
      status VARCHAR(20) DEFAULT 'free' CHECK (status IN ('free', 'occupied')),
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
    console.log('PostgreSQL Tables Initialized');
}

module.exports = { sql, initDb };
