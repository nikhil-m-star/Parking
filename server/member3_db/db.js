const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('CRITICAL ERROR: DATABASE_URL is not defined. Please add it to your environment variables.');
}

const sql = databaseUrl ? neon(databaseUrl) : null;

// Function to initialize tables (Member 3 task)
async function initDb() {
  if (!sql) {
    throw new Error('Database connection failed: DATABASE_URL is missing.');
  }
  try {
    await sql`
            CREATE TABLE IF NOT EXISTS parking_slots (
                id SERIAL PRIMARY KEY,
                number INTEGER UNIQUE NOT NULL,
                status VARCHAR(20) DEFAULT 'free' CHECK (status IN ('free', 'occupied')),
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
    console.log('PostgreSQL Tables Initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

module.exports = { sql, initDb };
