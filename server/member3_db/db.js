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
    // Users Table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        phone VARCHAR(20),
        vehicle_plate VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Parking Slots Table
    await sql`
      CREATE TABLE IF NOT EXISTS parking_slots (
        id SERIAL PRIMARY KEY,
        number INTEGER UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'free' CHECK (status IN ('free', 'occupied')),
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Reservations Table
    await sql`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        slot_id INTEGER NOT NULL REFERENCES parking_slots(id) ON DELETE CASCADE,
        vehicle_plate VARCHAR(20),
        check_in_time TIMESTAMP,
        check_out_time TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
        duration_hours INTEGER,
        amount_paid DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Parking History Table
    await sql`
      CREATE TABLE IF NOT EXISTS parking_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        slot_number INTEGER NOT NULL,
        vehicle_plate VARCHAR(20),
        check_in TIMESTAMP NOT NULL,
        check_out TIMESTAMP,
        duration_minutes INTEGER,
        amount_paid DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create Indexes for faster queries
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_parking_history_user_id ON parking_history(user_id);`;

    console.log('PostgreSQL Tables Initialized Successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Helper function to get user by email
async function getUserByEmail(email) {
  if (!sql) throw new Error('Database connection failed');
  const user = await sql`SELECT * FROM users WHERE email = ${email}`;
  return user[0] || null;
}

// Helper function to get user by ID
async function getUserById(id) {
  if (!sql) throw new Error('Database connection failed');
  const user = await sql`SELECT * FROM users WHERE id = ${id}`;
  return user[0] || null;
}

// Helper function to create a new user
async function createUser(email, username, passwordHash, fullName, phone) {
  if (!sql) throw new Error('Database connection failed');
  const result = await sql`
    INSERT INTO users (email, username, password_hash, full_name, phone)
    VALUES (${email}, ${username}, ${passwordHash}, ${fullName}, ${phone})
    RETURNING id, email, username, full_name, phone, created_at
  `;
  return result[0];
}

// Helper function to get user's active reservations
async function getUserReservations(userId) {
  if (!sql) throw new Error('Database connection failed');
  const reservations = await sql`
    SELECT r.*, ps.number as slot_number
    FROM reservations r
    JOIN parking_slots ps ON r.slot_id = ps.id
    WHERE r.user_id = ${userId}
    ORDER BY r.created_at DESC
  `;
  return reservations;
}

// Helper function to create a reservation
async function createReservation(userId, slotId, vehiclePlate) {
  if (!sql) throw new Error('Database connection failed');
  const result = await sql`
    INSERT INTO reservations (user_id, slot_id, vehicle_plate, check_in_time, status)
    VALUES (${userId}, ${slotId}, ${vehiclePlate}, CURRENT_TIMESTAMP, 'active')
    RETURNING *
  `;
  
  // Update slot status
  await sql`UPDATE parking_slots SET status = 'occupied' WHERE id = ${slotId}`;
  
  return result[0];
}

// Helper function to end a reservation
async function endReservation(reservationId, slotId) {
  if (!sql) throw new Error('Database connection failed');
  const result = await sql`
    UPDATE reservations 
    SET check_out_time = CURRENT_TIMESTAMP, status = 'completed'
    WHERE id = ${reservationId}
    RETURNING *
  `;
  
  // Update slot status
  await sql`UPDATE parking_slots SET status = 'free' WHERE id = ${slotId}`;
  
  return result[0];
}

module.exports = {
  sql,
  initDb,
  getUserByEmail,
  getUserById,
  createUser,
  getUserReservations,
  createReservation,
  endReservation
};
