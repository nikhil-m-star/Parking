# Database Seeding Guide - Member 3

Complete guide for populating the Smart Parking System database with sample data.

## Overview

Two seeding methods are provided:

1. **Node.js Script** (`seed.js`) - Recommended for development/testing
2. **SQL Script** (`seed.sql`) - For direct database operations

## Method 1: Node.js Seeding Script (Recommended)

### Quick Start

```bash
# From project root
npm run seed
```

### What Gets Created

✅ **10 Sample Users**
- Email: john.doe@email.com, Password: Password@1
- Email: jane.smith@email.com, Password: Password@2
- Email: admin@parking.com, Password: Admin@123
- 7 additional test users

✅ **30 Parking Slots**
- Level 1: Slots 101-120
- Level 2: Slots 201-210
- Mixed free/occupied status

✅ **7 Active Reservations**
- Currently checked-in users
- Occupying different slots

✅ **10 Parking History Records**
- Past parking sessions
- Duration and payment data
- Revenue tracking

### Test Credentials

```
Email: john.doe@email.com
Password: Password@1

Email: admin@parking.com
Password: Admin@123
```

## Method 2: Direct SQL Execution

### Using psql CLI

```bash
# Connect to your Neon database
psql "your_database_url_here" < server/member3_db/seed.sql
```

### Via Node.js Query Tool

```bash
node
> const { sql } = require('./server/member3_db/db.js');
> const seedScript = require('fs').readFileSync('./server/member3_db/seed.sql', 'utf8');
> await sql.file(seedScript);
```

## Database Statistics After Seeding

```
👥 Users: 10
🅿️  Total Slots: 30
  ✓ Free: 21
  ✗ Occupied: 9
📊 Occupancy Rate: 30%
📅 Active Reservations: 7
📜 Parking History: 10
```

## Sample Data Details

### Users Table

| Email | Username | Full Name | Vehicle Plate | Password |
|-------|----------|-----------|---------------|----------|
| admin@parking.com | admin_user | Admin User | ADMIN01 | Admin@123 |
| john.doe@email.com | john_doe | John Doe | JD-2024 | Password@1 |
| jane.smith@email.com | jane_smith | Jane Smith | JS-5555 | Password@2 |
| michael.johnson@email.com | mjohnson | Michael Johnson | MJ-9012 | Password@3 |
| sarah.williams@email.com | swilliams | Sarah Williams | SW-3456 | Password@4 |
| robert.brown@email.com | rbrown | Robert Brown | RB-7890 | Password@5 |
| emily.davis@email.com | edavis | Emily Davis | ED-2345 | Password@6 |
| david.miller@email.com | dmiller | David Miller | DM-6789 | Password@7 |
| lisa.wilson@email.com | lwilson | Lisa Wilson | LW-4567 | Password@8 |
| james.moore@email.com | jmoore | James Moore | JM-8901 | Password@9 |

### Parking Slots Status

```
Level 1 (101-120):
  Free:     103, 105, 106, 108, 110, 111, 113, 114, 116, 118, 119 (11 slots)
  Occupied: 102, 104, 107, 109, 112, 115, 117, 120 (8 slots)
  Occupancy: 42%

Level 2 (201-210):
  Free:     201, 202, 204, 206, 207, 209, 210 (7 slots)
  Occupied: 203, 205, 208 (3 slots)
  Occupancy: 30%

Overall: 21 free, 9 occupied (30% occupancy)
```

### Active Reservations

- User 2 (Jane Smith) in Slot 102 - 2h 0m duration
- User 3 (Michael Johnson) in Slot 104 - 1h 30m duration
- User 4 (Sarah Williams) in Slot 107 - 45m duration
- User 5 (Robert Brown) in Slot 109 - 30m duration
- User 6 (Emily Davis) in Slot 112 - 1h 0m duration
- User 7 (David Miller) in Slot 115 - 3h 0m duration
- User 8 (Lisa Wilson) in Slot 117 - 20m duration

### Parking History

- 10 completed sessions
- Date range: 1-5 days ago
- Total parking hours: 19.5 hours
- Revenue: ~$117

## Clearing Data Before Re-seeding

The seeding script automatically clears existing data. To preserve data and append:

1. **Edit `seed.js`** (lines 102-109):
```javascript
// Comment out the DELETE statements
// await sql`DELETE FROM parking_history;`;
// await sql`DELETE FROM reservations;`;
// await sql`DELETE FROM parking_slots;`;
// await sql`DELETE FROM users;`;
```

2. **Run seed script again**

## Troubleshooting

### Error: "Database connection failed: DATABASE_URL is missing"

**Solution:** Set DATABASE_URL in `.env`
```bash
# In .env file
DATABASE_URL=postgresql://user:password@neon.tech/parking_db
```

### Error: "password authentication failed for user"

**Solution:** Verify DATABASE_URL credentials are correct
```bash
# Test connection
psql "your_database_url_here" -c "SELECT 1"
```

### Error: "relation 'users' does not exist"

**Solution:** Initialize database schema first
```bash
# Database tables created automatically on first server startup
npm start
```

### Duplicate Key Error

**Solution:** Clear existing data before re-seeding
```bash
node -e "require('./server/member3_db/db.js').clearAll()"
```

## Verifying Seeded Data

### Check Users
```bash
curl http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer {token}"
```

### Check Slots Status
```bash
curl http://localhost:5000/api/slots
```

### Check Active Reservations
```bash
curl http://localhost:5000/api/reservations \
  -H "Authorization: Bearer {token}"
```

### Socket.io Real-Time Updates
```javascript
const io = require('socket.io-client');
const socket = io('http://localhost:5000/parking');

socket.on('slots:status-update', (data) => {
  console.log('Slot updated:', data);
});

socket.on('reservations:new', (data) => {
  console.log('New reservation:', data);
});
```

## Sample API Flows

### 1. Login and Get Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@email.com",
    "password": "Password@1"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "john.doe@email.com",
    "fullName": "John Doe",
    "vehiclePlate": "JD-2024"
  }
}
```

### 2. Make a Reservation

```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": 105,
    "vehiclePlate": "JD-2024"
  }'
```

### 3. End Reservation (Check Out)

```bash
curl -X PUT http://localhost:5000/api/reservations/{reservationId}/end \
  -H "Authorization: Bearer {token}"
```

## Next Steps

1. ✅ Run seed script: `npm run seed`
2. ✅ Test authentication with provided credentials
3. ✅ Create reservations and test Socket.io updates
4. ✅ Monitor occupancy rates in real-time
5. ✅ Test payment tracking with parking history

## Architecture Notes

**Password Hashing:**
- Using bcryptjs with 10 salt rounds
- Passwords never stored in plaintext
- Sample passwords: Password@1-9, Admin@123

**Database Constraints:**
- User emails are unique
- Parking slot numbers are unique
- Foreign key relationships enforced
- Automatic timestamps for created_at, updated_at

**Real-Time Events:**
- Slot status updates broadcast via Socket.io
- Reservation changes trigger notifications
- Payment history recorded immediately

## Related Files

- [db.js](./db.js) - Database connection and queries
- [seed.sql](./seed.sql) - Raw SQL seeding script
- [authRoutes.js](./authRoutes.js) - Authentication endpoints
- [reservationRoutes.js](./reservationRoutes.js) - Reservation management
- [socketIO.js](./socketIO.js) - Real-time event handlers
