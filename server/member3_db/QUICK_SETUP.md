# Quick Setup Guide - Database & Auth Module

## What Was Added

Your Database & Auth module is now complete with:
- ✅ User registration & login system
- ✅ JWT token authentication  
- ✅ PostgreSQL database with users, reservations, and history tables
- ✅ Parking reservation management
- ✅ Password encryption with bcryptjs
- ✅ Protected API endpoints
- ✅ Complete documentation

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

This will add:
- `bcryptjs` - For secure password hashing
- `jsonwebtoken` - For JWT token handling

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp server/member3_db/.env.example .env
```

Edit `.env` and add your values:
```env
DATABASE_URL=your_neon_postgresql_url
JWT_SECRET=your_very_secret_key_here
NODE_ENV=development
PORT=5000
```

### 3. Start the Server
```bash
npm start
# or with nodemon for development
npx nodemon server/server.js
```

The server will automatically initialize all database tables on startup.

## Testing the APIs

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "john_doe",
    "password": "password123",
    "fullName": "John Doe",
    "phone": "+1234567890"
  }'
```

**Response (save the token):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Get User Profile (Protected)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Create a Parking Reservation (Protected)
First, get a free slot:
```bash
curl http://localhost:5000/api/slots
```

Then create reservation with slot ID:
```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "slotId": 1,
    "vehiclePlate": "ABC123"
  }'
```

### 5. End a Parking Session (Protected)
```bash
curl -X PUT http://localhost:5000/api/reservations/1/end \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. View Parking History (Protected)
```bash
curl -X GET http://localhost:5000/api/reservations/history/all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## API Endpoints Summary

### Authentication (`/api/auth`)
| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | /register | ❌ | Create new user account |
| POST | /login | ❌ | Login and get JWT token |
| GET | /profile | ✅ | Get current user details |
| PUT | /profile | ✅ | Update user profile |
| POST | /verify | ✅ | Verify token validity |

### Reservations (`/api/reservations`)
| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| GET | / | ✅ | Get user's reservations |
| POST | / | ✅ | Create new reservation |
| PUT | /:id/end | ✅ | End parking session |
| PUT | /:id/cancel | ✅ | Cancel reservation |
| GET | /history/all | ✅ | Get parking history |

### Parking Slots (`/api/slots`)
| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| GET | / | ❌ | List all parking slots |
| GET | /:number | ❌ | Get specific slot details |
| POST | / | ❌ | Create new slot |
| DELETE | /:number | ❌ | Delete slot |

## Database Tables

**users** - User accounts and profiles
**parking_slots** - Parking spot inventory  
**reservations** - Active/completed parking sessions
**parking_history** - Historical parking data for analytics

## File Structure

```
server/member3_db/
├── db.js                    # Database connection & helpers
├── authMiddleware.js        # JWT verification middleware
├── authRoutes.js            # Authentication endpoints
├── reservationRoutes.js     # Reservation management
├── README.md                # Full API documentation
├── IMPLEMENTATION.md        # What was implemented
├── .env.example            # Environment template
└── QUICK_SETUP.md          # This file
```

## Troubleshooting

### "DATABASE_URL is not defined"
- Make sure you have `.env` file with `DATABASE_URL` set
- Restart the server after adding the variable

### "Token is invalid"
- Check token is passed with `Authorization: Bearer TOKEN` format
- Tokens expire after 24 hours - login again to get new token

### "Parking slot not available"
- Check slot status is 'free' using `GET /api/slots`
- Cancel other active reservations if needed

### Database table creation fails
- Ensure DATABASE_URL points to valid PostgreSQL instance
- Check network connectivity to Neon database
- Verify database user has permission to create tables

## Security Notes

⚠️ **Important for Production:**
1. Change JWT_SECRET to a strong, random value
2. Use HTTPS for all API calls
3. Implement rate limiting on auth endpoints
4. Never commit `.env` file to git
5. Store sensitive keys in environment variables only
6. Consider adding email verification for new accounts
7. Implement password reset functionality

## Next Steps

1. ✅ Database & Auth module is ready
2. 🔄 Integrate with React frontend for login/register UI
3. 🔄 Add admin panel for managing parking slots
4. 🔄 Implement payment processing
5. 🔄 Add email notifications
6. 🔄 Deploy to production (Vercel/Heroku)

## Questions?

Refer to detailed documentation:
- Full API docs: `README.md`
- Implementation details: `IMPLEMENTATION.md`
- Example env file: `.env.example`
