/**
 * Database Seeding Script - Member 3
 * Populates the database with sample data for testing
 * 
 * Usage: node seed.js
 */

require('dotenv').config();
const { sql } = require('./db');
const bcrypt = require('bcryptjs');

// Sample data configuration
const SAMPLE_DATA = {
  users: [
    { email: 'admin@parking.com', username: 'admin_user', password: 'Admin@123', fullName: 'Admin User', phone: '+1-800-PARKING', vehiclePlate: 'ADMIN01' },
    { email: 'john.doe@email.com', username: 'john_doe', password: 'Password@1', fullName: 'John Doe', phone: '+1-555-1234', vehiclePlate: 'JD-2024' },
    { email: 'jane.smith@email.com', username: 'jane_smith', password: 'Password@2', fullName: 'Jane Smith', phone: '+1-555-5678', vehiclePlate: 'JS-5555' },
    { email: 'michael.johnson@email.com', username: 'mjohnson', password: 'Password@3', fullName: 'Michael Johnson', phone: '+1-555-9012', vehiclePlate: 'MJ-9012' },
    { email: 'sarah.williams@email.com', username: 'swilliams', password: 'Password@4', fullName: 'Sarah Williams', phone: '+1-555-3456', vehiclePlate: 'SW-3456' },
    { email: 'robert.brown@email.com', username: 'rbrown', password: 'Password@5', fullName: 'Robert Brown', phone: '+1-555-7890', vehiclePlate: 'RB-7890' },
    { email: 'emily.davis@email.com', username: 'edavis', password: 'Password@6', fullName: 'Emily Davis', phone: '+1-555-2345', vehiclePlate: 'ED-2345' },
    { email: 'david.miller@email.com', username: 'dmiller', password: 'Password@7', fullName: 'David Miller', phone: '+1-555-6789', vehiclePlate: 'DM-6789' },
    { email: 'lisa.wilson@email.com', username: 'lwilson', password: 'Password@8', fullName: 'Lisa Wilson', phone: '+1-555-4567', vehiclePlate: 'LW-4567' },
    { email: 'james.moore@email.com', username: 'jmoore', password: 'Password@9', fullName: 'James Moore', phone: '+1-555-8901', vehiclePlate: 'JM-8901' }
  ],

  parkingSlots: [
    // Level 1 (101-120)
    { number: 101, status: 'free' },
    { number: 102, status: 'occupied' },
    { number: 103, status: 'free' },
    { number: 104, status: 'occupied' },
    { number: 105, status: 'free' },
    { number: 106, status: 'free' },
    { number: 107, status: 'occupied' },
    { number: 108, status: 'free' },
    { number: 109, status: 'occupied' },
    { number: 110, status: 'free' },
    { number: 111, status: 'free' },
    { number: 112, status: 'occupied' },
    { number: 113, status: 'free' },
    { number: 114, status: 'free' },
    { number: 115, status: 'occupied' },
    { number: 116, status: 'free' },
    { number: 117, status: 'occupied' },
    { number: 118, status: 'free' },
    { number: 119, status: 'free' },
    { number: 120, status: 'occupied' },
    // Level 2 (201-210)
    { number: 201, status: 'free' },
    { number: 202, status: 'free' },
    { number: 203, status: 'occupied' },
    { number: 204, status: 'free' },
    { number: 205, status: 'occupied' },
    { number: 206, status: 'free' },
    { number: 207, status: 'free' },
    { number: 208, status: 'occupied' },
    { number: 209, status: 'free' },
    { number: 210, status: 'free' }
  ]
};

/**
 * Main seeding function
 */
async function seedDatabase() {
  try {
    if (!sql) {
      throw new Error('Database connection failed: DATABASE_URL is missing');
    }

    console.log('\n🌱 Starting database seeding...\n');

    // =====================================================
    // 1. Clear existing data (optional - comment out to append)
    // =====================================================
    console.log('📋 Clearing existing data...');
    try {
      await sql`DELETE FROM parking_history;`;
      await sql`DELETE FROM reservations;`;
      await sql`DELETE FROM parking_slots;`;
      await sql`DELETE FROM users;`;
      console.log('✅ Cleared all tables\n');
    } catch (err) {
      console.log('⚠️  Tables may not exist yet, continuing...\n');
    }

    // =====================================================
    // 2. Seed Users
    // =====================================================
    console.log('👥 Seeding users...');
    const users = [];
    
    for (const userData of SAMPLE_DATA.users) {
      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 10);
      
      const result = await sql`
        INSERT INTO users (email, username, password_hash, full_name, phone, vehicle_plate)
        VALUES (${userData.email}, ${userData.username}, ${passwordHash}, ${userData.fullName}, ${userData.phone}, ${userData.vehiclePlate})
        RETURNING id, email, username, full_name, phone, vehicle_plate
      `;
      
      users.push(result[0]);
      console.log(`  ✓ ${userData.email}`);
    }
    console.log(`✅ Created ${users.length} users\n`);

    // =====================================================
    // 3. Seed Parking Slots
    // =====================================================
    console.log('🅿️  Seeding parking slots...');
    const slots = [];
    
    for (const slotData of SAMPLE_DATA.parkingSlots) {
      const result = await sql`
        INSERT INTO parking_slots (number, status)
        VALUES (${slotData.number}, ${slotData.status})
        RETURNING id, number, status
      `;
      slots.push(result[0]);
    }
    console.log(`✅ Created ${slots.length} parking slots\n`);

    // =====================================================
    // 4. Seed Active Reservations
    // =====================================================
    console.log('📅 Seeding active reservations...');
    const now = new Date();
    const reservations = [
      { userId: users[1].id, slotId: slots[1].id, vehiclePlate: users[1].vehicle_plate, hoursAgo: 2 },
      { userId: users[2].id, slotId: slots[3].id, vehiclePlate: users[2].vehicle_plate, hoursAgo: 1.5 },
      { userId: users[3].id, slotId: slots[6].id, vehiclePlate: users[3].vehicle_plate, hoursAgo: 0.75 },
      { userId: users[4].id, slotId: slots[8].id, vehiclePlate: users[4].vehicle_plate, hoursAgo: 0.5 },
      { userId: users[5].id, slotId: slots[11].id, vehiclePlate: users[5].vehicle_plate, hoursAgo: 1 },
      { userId: users[6].id, slotId: slots[14].id, vehiclePlate: users[6].vehicle_plate, hoursAgo: 3 },
      { userId: users[7].id, slotId: slots[16].id, vehiclePlate: users[7].vehicle_plate, hoursAgo: 0.33 }
    ];

    for (const res of reservations) {
      const checkInTime = new Date(now.getTime() - res.hoursAgo * 3600000);
      await sql`
        INSERT INTO reservations (user_id, slot_id, vehicle_plate, check_in_time, status)
        VALUES (${res.userId}, ${res.slotId}, ${res.vehiclePlate}, ${checkInTime}, 'active')
      `;
      console.log(`  ✓ Slot ${slots.find(s => s.id === res.slotId).number} reserved`);
    }
    console.log(`✅ Created ${reservations.length} active reservations\n`);

    // =====================================================
    // 5. Seed Parking History
    // =====================================================
    console.log('📊 Seeding parking history...');
    const historyEntries = [
      { userId: users[1].id, slotNumber: 105, vehiclePlate: users[1].vehicle_plate, daysAgo: 1, hoursParked: 2 },
      { userId: users[2].id, slotNumber: 108, vehiclePlate: users[2].vehicle_plate, daysAgo: 1, hoursParked: 1.5 },
      { userId: users[3].id, slotNumber: 106, vehiclePlate: users[3].vehicle_plate, daysAgo: 2, hoursParked: 1 },
      { userId: users[4].id, slotNumber: 110, vehiclePlate: users[4].vehicle_plate, daysAgo: 2, hoursParked: 2 },
      { userId: users[5].id, slotNumber: 111, vehiclePlate: users[5].vehicle_plate, daysAgo: 3, hoursParked: 1.5 },
      { userId: users[6].id, slotNumber: 114, vehiclePlate: users[6].vehicle_plate, daysAgo: 3, hoursParked: 3 },
      { userId: users[7].id, slotNumber: 116, vehiclePlate: users[7].vehicle_plate, daysAgo: 4, hoursParked: 3 },
      { userId: users[8].id, slotNumber: 101, vehiclePlate: users[8].vehicle_plate, daysAgo: 4, hoursParked: 3 },
      { userId: users[9].id, slotNumber: 103, vehiclePlate: users[9].vehicle_plate, daysAgo: 5, hoursParked: 2 },
      { userId: users[1].id, slotNumber: 104, vehiclePlate: users[1].vehicle_plate, daysAgo: 5, hoursParked: 2 }
    ];

    for (const entry of historyEntries) {
      const checkOutTime = new Date(now.getTime() - entry.daysAgo * 86400000);
      const checkInTime = new Date(checkOutTime.getTime() - entry.hoursParked * 3600000);
      const amountPaid = (entry.hoursParked * 6).toFixed(2); // $6 per hour

      await sql`
        INSERT INTO parking_history (user_id, slot_number, vehicle_plate, check_in, check_out, duration_minutes, amount_paid)
        VALUES (${entry.userId}, ${entry.slotNumber}, ${entry.vehiclePlate}, ${checkInTime}, ${checkOutTime}, ${Math.round(entry.hoursParked * 60)}, ${parseFloat(amountPaid)})
      `;
      console.log(`  ✓ ${entry.vehiclePlate} - ${entry.hoursParked}h parking`);
    }
    console.log(`✅ Created ${historyEntries.length} parking history entries\n`);

    // =====================================================
    // 6. Display Statistics
    // =====================================================
    console.log('📈 Database Statistics:\n');
    
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    console.log(`  👥 Users: ${userCount[0].count}`);
    
    const slotCount = await sql`SELECT COUNT(*) as count FROM parking_slots`;
    console.log(`  🅿️  Total Slots: ${slotCount[0].count}`);
    
    const occupiedCount = await sql`SELECT COUNT(*) as count FROM parking_slots WHERE status = 'occupied'`;
    const freeCount = slotCount[0].count - occupiedCount[0].count;
    console.log(`  ✓ Free: ${freeCount} | ✗ Occupied: ${occupiedCount[0].count}`);
    
    const occupancyRate = ((occupiedCount[0].count / slotCount[0].count) * 100).toFixed(1);
    console.log(`  📊 Occupancy Rate: ${occupancyRate}%`);
    
    const activeRes = await sql`SELECT COUNT(*) as count FROM reservations WHERE status = 'active'`;
    console.log(`  📅 Active Reservations: ${activeRes[0].count}`);
    
    const history = await sql`SELECT COUNT(*) as count FROM parking_history`;
    console.log(`  📜 Parking History: ${history[0].count}`);

    // =====================================================
    // 7. Test Credentials
    // =====================================================
    console.log('\n🔑 Test Credentials:\n');
    console.log('  Email: john.doe@email.com');
    console.log('  Password: Password@1');
    console.log('\n  Email: admin@parking.com');
    console.log('  Password: Admin@123');
    console.log('\n✅ Database seeding completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
