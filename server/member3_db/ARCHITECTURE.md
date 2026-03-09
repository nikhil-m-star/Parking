# Database & Auth Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Client)                   │
│  ├─ Login Component                                           │
│  ├─ Registration Component                                    │
│  ├─ User Profile Page                                         │
│  └─ Parking Reservations Dashboard                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              EXPRESS SERVER (server/server.js)                │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            API Routes                                 │   │
│  ├────────────────────────────────────────────────────┤   │
│  │ /api/auth/          → authRoutes.js                  │   │
│  │   ├─ POST /register                                  │   │
│  │   ├─ POST /login                                     │   │
│  │   ├─ GET /profile  (Protected)                       │   │
│  │   ├─ PUT /profile  (Protected)                       │   │
│  │   └─ POST /verify  (Protected)                       │   │
│  │                                                      │   │
│  │ /api/reservations/  → reservationRoutes.js          │   │
│  │   ├─ GET /         (Protected)                       │   │
│  │   ├─ POST /        (Protected)                       │   │
│  │   ├─ PUT /:id/end  (Protected)                       │   │
│  │   ├─ PUT /:id/cancel (Protected)                     │   │
│  │   └─ GET /history/all (Protected)                    │   │
│  │                                                      │   │
│  │ /api/slots/         → slotRoutes.js (Member 2)      │   │
│  │   ├─ GET /                                           │   │
│  │   ├─ POST /                                          │   │
│  │   └─ DELETE /:number                                 │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Middleware & Authentication                   │   │
│  ├────────────────────────────────────────────────────┤   │
│  │ cors()              → Enable cross-origin requests   │   │
│  │ express.json()      → Parse JSON bodies              │   │
│  │ verifyToken()       → Validate JWT for protected      │   │
│  │                       routes                          │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────┬──────────────┬──────────────┬────────────────────┘
           │              │              │
           ▼              ▼              ▼
    ┌─────────────┐ ┌──────────────┐ ┌──────────────┐
    │ authRoutes  │ │ reservation  │ │  slotRoutes  │
    │             │ │   Routes     │ │  (Member 2)  │
    └──────┬──────┘ └──────┬───────┘ └──────┬───────┘
           │                │                │
           └────────────────┼────────────────┘
                            ▼
         ┌────────────────────────────────────┐
         │   db.js (Database Functions)       │
         │  ├─ getUserByEmail()               │
         │  ├─ createUser()                   │
         │  ├─ createReservation()            │
         │  ├─ getUserReservations()          │
         │  ├─ endReservation()               │
         │  └─ ... other helpers              │
         └────────────┬───────────────────────┘
                      ▼
         ┌────────────────────────────────────┐
         │  PostgreSQL Database (Neon.tech)   │
         ├────────────────────────────────────┤
         │ Table: users                       │
         │ ├─ id, email, username             │
         │ ├─ password_hash, full_name        │
         │ ├─ phone, vehicle_plate            │
         │ └─ created_at, updated_at          │
         │                                    │
         │ Table: parking_slots               │
         │ ├─ id, number, status              │
         │ └─ last_updated                    │
         │                                    │
         │ Table: reservations                │
         │ ├─ id, user_id, slot_id            │
         │ ├─ vehicle_plate, check_in/out     │
         │ ├─ status, amount_paid             │
         │ └─ created_at, updated_at          │
         │                                    │
         │ Table: parking_history             │
         │ ├─ id, user_id, slot_number        │
         │ ├─ check_in, check_out             │
         │ └─ duration_minutes, amount_paid   │
         └────────────────────────────────────┘
```

## Authentication Flow

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       │ 1. Enter Email & Password
       ▼
   ┌────────────────────┐
   │ POST /api/auth/login │
   └────────┬────────────┘
            │
            │ 2. Validate credentials
            ▼
   ┌─────────────────────────────────┐
   │ db.getUserByEmail()             │
   │ bcrypt.compare()                │
   └────────┬────────────────────────┘
            │
            │ 3. Generate JWT token
            │ (if valid)
            ▼
   ┌─────────────────────────────────┐
   │ jwt.sign()                      │
   │ payload: {id, email, username}  │
   │ expires: 24h                    │
   └────────┬────────────────────────┘
            │
            │ 4. Return token to client
            ▼
   ┌─────────────────────────────────┐
   │ Client stores token in          │
   │ localStorage / sessionStorage    │
   └────────┬────────────────────────┘
            │
   ┌────────┴──────────────────────────────┐
   │                                       │
   │ 5. Include in future API calls        │
   ▼                                       ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│ GET /api/auth/profile   │   │ POST /api/reservations  │
│ Headers:                │   │ Headers:                │
│ Authorization:          │   │ Authorization:          │
│ Bearer TOKEN            │   │ Bearer TOKEN            │
└────────┬────────────────┘   └────────┬────────────────┘
         │                             │
         │ 6. Verify token            │
         └──────────┬──────────────────┘
                    │
                    ▼
         ┌────────────────────────────┐
         │ verifyToken() middleware   │
         │ jwt.verify()               │
         └────────┬───────────────────┘
                  │
           ┌──────┴──────┐
           │             │
        Valid          Invalid
           │             │
           ▼             ▼
      ┌────────┐    ┌──────────┐
      │ Allow  │    │ 401 Error│
      │Request │    │Unauthorized
      └────────┘    └──────────┘
```

## Reservation Workflow

```
┌──────────────────────────────────────────────────────────┐
│               User Parking Workflow                       │
└──────────┬───────────────────────────────────────────────┘
           │
           │ 1. View Available Slots
           ▼
┌─────────────────────────────────────────────────┐
│ GET /api/slots                                   │
│ Response: [                                      │
│   {id:1, number:101, status:"free"},            │
│   {id:2, number:102, status:"free"},            │
│   {id:3, number:103, status:"occupied"}         │
│ ]                                               │
└────────────┬────────────────────────────────────┘
             │
             │ 2. Select Free Slot & Create Reservation
             ▼
┌─────────────────────────────────────────────────┐
│ POST /api/reservations                          │
│ Body: {slotId: 1, vehiclePlate: "ABC123"}      │
│ Headers: Authorization: Bearer TOKEN            │
└────────────┬────────────────────────────────────┘
             │
             │ 3. Check Slot Availability
             ▼
    ┌────────────────────┐
    │ Is status "free"?  │
    └─────┬────────┬─────┘
          │        │
        Yes      No
          │        │
          ▼        ▼
      ┌───────┐ ┌─────────────┐
      │Create │ │ 409 Error   │
      │Resv.  │ │Slot Not Free│
      └───┬───┘ └─────────────┘
          │
          │ 4. Update Slot Status
          ▼
   ┌─────────────────────────┐
   │ SET status='occupied'   │
   │ WHERE id=1              │
   └───┬─────────────────────┘
       │
       │ 5. Return Reservation
       ▼
┌──────────────────────────────────┐
│ {                                │
│   id: 1,                         │
│   slot_id: 1,                    │
│   status: "active",              │
│   check_in_time: "2024-03-04...", │
│   vehicle_plate: "ABC123"        │
│ }                                │
└──────────┬───────────────────────┘
           │
           │ ... User parked in slot ...
           │
           │ 6. End Reservation
           ▼
┌─────────────────────────────────┐
│ PUT /api/reservations/1/end      │
│ Headers: Authorization: Bearer.. │
└────────────┬────────────────────┘
             │
             │ 7. Update Reservation
             ▼
    ┌──────────────────────────────┐
    │ SET status='completed'       │
    │ SET check_out_time=NOW()     │
    └───┬────────────────────────┬─┘
        │                        │
        │ 8. Free Slot           │ 9. Add to History
        ▼                        ▼
    ┌─────────────────┐  ┌───────────────────┐
    │ SET status=     │  │ INSERT INTO       │
    │'free'           │  │ parking_history   │
    └─────────────────┘  └───────────────────┘
           │
           ▼
    ┌──────────────────┐
    │Session Complete! │
    └──────────────────┘
```

## Security Architecture

```
┌──────────────────────────────────────────────────┐
│          Security Layers                         │
└──────────────────────────────────────────────────┘
                    ▼
        ┌──────────────────────────┐
        │ 1. CORS Validation       │
        │ Only allowed origins     │
        └──────────┬───────────────┘
                   ▼
        ┌──────────────────────────┐
        │ 2. Input Validation      │
        │ Check required fields    │
        │ Format checking          │
        └──────────┬───────────────┘
                   ▼
        ┌──────────────────────────┐
        │ 3. Password Hashing      │
        │ bcrypt.hash()            │
        │ 10 rounds/salt           │
        └──────────┬───────────────┘
                   ▼
        ┌──────────────────────────┐
        │ 4. Token Generation      │
        │ JWT.sign()               │
        │ 24hr expiry              │
        └──────────┬───────────────┘
                   ▼
        ┌──────────────────────────┐
        │ 5. Token Verification    │
        │ JWT.verify()             │
        │ Check signature & exp.   │
        └──────────┬───────────────┘
                   ▼
        ┌──────────────────────────┐
        │ 6. Authorization Check   │
        │ User can only access     │
        │ their own data           │
        └──────────┬───────────────┘
                   ▼
        ┌──────────────────────────┐
        │ 7. SQL Injection Prevent │
        │ Parameterized queries    │
        │ via Neon serverless      │
        └──────────────────────────┘
```

## Data Flow Example: User Registration

```
User Form (React)
    │
    │ 1. Collect data
    │    email, username, password, fullName, phone
    ▼
POST /api/auth/register
    │
    │ 2. Express receives request
    │    app.post('/register', ...)
    ▼
Input Validation
    │
    │ 3. Check all fields present
    │    Check email not already registered
    ▼
Password Hashing
    │
    │ 4. bcrypt.genSalt(10)
    │    bcrypt.hash(password, salt)
    ▼
Database Insert
    │
    │ 5. createUser() function
    │    INSERT INTO users (...)
    │    RETURNING id, email, username, ...
    ▼
Token Generation
    │
    │ 6. jwt.sign({id, email, username}, JWT_SECRET)
    ▼
Response to Client
    │
    │ 7. {
    │      token: "eyJ...",
    │      user: {id, email, username, fullName}
    │    }
    ▼
Client Storage
    │
    │ 8. localStorage.setItem('token', token)
    │    or sessionStorage
    ▼
Ready to Use
    │
    ▼
All future requests include:
Authorization: Bearer eyJ...
```

## Database Relationships

```
┌────────────┐
│   users    │◄─┐
├────────────┤  │ (ONE-TO-MANY)
│ id (PK)    │  │
│ email (UK) │  │
│ username   │  │
│ password_h │  │
│ full_name  │  │
│ phone      │  │
└────────┬───┘  │
         │      │
         │ has  │
         │      │
         ▼      │
    ┌────────────────────┐
    │ reservations       │
    ├────────────────────┤
    │ id (PK)            │
    │ user_id (FK) ──────┘
    │ slot_id (FK) ───┐
    │ vehicle_plate   │
    │ check_in_time   │
    │ check_out_time  │
    │ status          │
    └────────────────┘
         ▲
         │ (MANY-TO-ONE)
         │
         │
    ┌────────────────┐
    │ parking_slots  │
    ├────────────────┤
    │ id (PK)        │
    │ number (UK)    │
    │ status         │
    │ last_updated   │
    └────────────────┘


    ┌────────────────────┐
    │ parking_history    │
    ├────────────────────┤
    │ id (PK)            │
    │ user_id (FK) ──────┐
    │ slot_number        │  references
    │ vehicle_plate      │  users.id
    │ check_in           │
    │ check_out          │
    │ duration_minutes   │
    │ amount_paid        │
    └────────────────────┘
```

## JWT Token Structure

```
┌─────────────────────────────────────────────────┐
│  JWT Token (returned after login/register)      │
└─────────────────────────────────────────────────┘

Format: Header.Payload.Signature

┌──────────────────────────────────────────┐
│ 1. HEADER                                │
├──────────────────────────────────────────┤
│ {                                        │
│   "alg": "HS256",                       │
│   "typ": "JWT"                          │
│ }                                        │
└──────────────────────────────────────────┘
         ↓ Base64Url Encode
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

┌──────────────────────────────────────────┐
│ 2. PAYLOAD                               │
├──────────────────────────────────────────┤
│ {                                        │
│   "id": 1,                              │
│   "email": "user@example.com",          │
│   "username": "john_doe",               │
│   "iat": 1709547600,                    │
│   "exp": 1709634000                     │
│ }                                        │
└──────────────────────────────────────────┘
         ↓ Base64Url Encode
    eyJpZCI6MSwic...

┌──────────────────────────────────────────┐
│ 3. SIGNATURE                             │
├──────────────────────────────────────────┤
│ HMACSHA256(                              │
│   header.payload,                        │
│   "JWT_SECRET_KEY"                       │
│ )                                        │
└──────────────────────────────────────────┘
         ↓ Base64Url Encode
    SflKxwRJSMe...

Complete Token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic...SflKxwRJSMe...

⏰ Expiry: 24 hours from issuance (iat + 86400 seconds)
```

This architecture provides:
✅ Scalable database design
✅ Secure authentication
✅ RESTful API structure
✅ Separation of concerns
✅ Easy integration with frontend
✅ Support for future features (payments, notifications, etc.)
