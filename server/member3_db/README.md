# Database & Authentication Module (Member 3)

## Overview
This module provides complete database management and authentication functionality for the Smart Parking System.

## Components

### 1. **db.js** - Database Configuration & Helpers
Handles PostgreSQL connection and provides utility functions for database operations.

**Key Functions:**
- `initDb()` - Initializes all database tables (users, parking_slots, reservations, parking_history)
- `getUserByEmail(email)` - Retrieves user by email
- `getUserById(id)` - Retrieves user by ID
- `createUser(email, username, passwordHash, fullName, phone)` - Creates new user
- `getUserReservations(userId)` - Gets all reservations for a user
- `createReservation(userId, slotId, vehiclePlate)` - Creates parking reservation
- `endReservation(reservationId, slotId)` - Ends active reservation

**Database Tables:**
1. **users** - User accounts and profiles
2. **parking_slots** - Parking spot inventory
3. **reservations** - Active/completed parking reservations
4. **parking_history** - Historical parking data

### 2. **authMiddleware.js** - JWT Authentication
Provides JWT token generation and verification for protected routes.

**Key Functions:**
- `verifyToken(req, res, next)` - Middleware to verify JWT tokens
- `generateToken(user)` - Creates JWT token for user

**Environment Variables:**
- `JWT_SECRET` - Secret key for signing tokens (default: 'your-secret-key-change-in-production')

### 3. **authRoutes.js** - Authentication Endpoints

**Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)
- `POST /api/auth/verify` - Verify token validity (Protected)

**Request/Response Examples:**

**Register:**
```javascript
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "username": "john_doe",
  "password": "securePassword123",
  "fullName": "John Doe",
  "phone": "+1234567890"
}

Response: {
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "fullName": "John Doe"
  }
}
```

**Login:**
```javascript
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: {
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "fullName": "John Doe",
    "phone": "+1234567890",
    "vehiclePlate": "ABC123"
  }
}
```

### 4. **reservationRoutes.js** - Parking Reservation Management

**Endpoints:**
- `GET /api/reservations` - Get user's reservations (Protected)
- `POST /api/reservations` - Create new reservation (Protected)
- `PUT /api/reservations/:reservationId/end` - End reservation (Protected)
- `PUT /api/reservations/:reservationId/cancel` - Cancel reservation (Protected)
- `GET /api/reservations/history/all` - Get parking history (Protected)

**Request/Response Examples:**

**Create Reservation:**
```javascript
POST /api/reservations
Headers: {
  "Authorization": "Bearer eyJhbGc..."
}
Body: {
  "slotId": 5,
  "vehiclePlate": "ABC123"
}

Response: {
  "message": "Reservation created successfully",
  "reservation": {
    "id": 1,
    "user_id": 1,
    "slot_id": 5,
    "vehicle_plate": "ABC123",
    "check_in_time": "2024-03-04T10:30:00Z",
    "status": "active"
  }
}
```

## Security Features

1. **Password Hashing** - Bcryptjs for secure password storage
2. **JWT Tokens** - Stateless authentication with expiry (24 hours)
3. **Protected Routes** - All reservation and profile endpoints require authentication
4. **Authorization** - Users can only access their own data
5. **SQL Injection Prevention** - Parameterized queries via Neon serverless

## Environment Variables Required

```env
DATABASE_URL=postgresql://user:password@host/database
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
PORT=5000
```

## Usage Flow

1. **Register User**
   ```
   POST /api/auth/register → User account created → JWT token returned
   ```

2. **Login User**
   ```
   POST /api/auth/login → User authenticated → JWT token returned
   ```

3. **Create Reservation**
   ```
   POST /api/reservations → Check slot availability → Create reservation → Update slot status
   ```

4. **End Parking Session**
   ```
   PUT /api/reservations/:id/end → Mark as completed → Add to history → Free slot
   ```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
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
```

### Reservations Table
```sql
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slot_id INTEGER NOT NULL REFERENCES parking_slots(id) ON DELETE CASCADE,
  vehicle_plate VARCHAR(20),
  check_in_time TIMESTAMP,
  check_out_time TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  duration_hours INTEGER,
  amount_paid DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Parking History Table
```sql
CREATE TABLE parking_history (
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
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with required variables

3. Initialize database:
   ```bash
   npm start
   ```

## Integration with Other Modules

- **Slots API (Member 2)**: Uses parking_slots table to check availability
- **IoT Simulator (Member 4)**: Updates parking status in real-time
- **Client (React)**: Consumes auth and reservation endpoints

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Profile (use token from login response)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create Reservation
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"slotId":1,"vehiclePlate":"ABC123"}'
```

## Future Enhancements

- Rate limiting for auth endpoints
- Email verification for new accounts
- Password reset functionality
- Two-factor authentication (2FA)
- Role-based access control (Admin, User)
- Payment integration
- Pricing calculation for parking duration
