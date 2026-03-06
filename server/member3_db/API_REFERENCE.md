# API Endpoints Reference

## Authentication Endpoints (`/api/auth`)

### 1. Register User
```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "securePassword123",
  "fullName": "John Doe",          (optional)
  "phone": "+1234567890"            (optional)
}

Success Response (201):
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "fullName": "John Doe"
  }
}

Error Response (409):
{
  "message": "Email already registered"
}
```

### 2. Login User
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "securePassword123"
}

Success Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "fullName": "John Doe",
    "phone": "+1234567890",
    "vehiclePlate": "ABC123"
  }
}

Error Response (401):
{
  "message": "Invalid email or password"
}
```

### 3. Get User Profile ✅ PROTECTED
```
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Success Response (200):
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "fullName": "John Doe",
    "phone": "+1234567890",
    "vehiclePlate": "ABC123",
    "createdAt": "2024-03-04T10:30:00Z"
  }
}

Error Response (401):
{
  "message": "No token provided"
}

Error Response (404):
{
  "message": "User not found"
}
```

### 4. Update User Profile ✅ PROTECTED
```
PUT /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

Request Body:
{
  "fullName": "John Updated",
  "phone": "+9876543210",
  "vehiclePlate": "XYZ789"
}

Success Response (200):
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "fullName": "John Updated",
    "phone": "+9876543210",
    "vehiclePlate": "XYZ789"
  }
}
```

### 5. Verify Token ✅ PROTECTED
```
POST /api/auth/verify
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Success Response (200):
{
  "message": "Token is valid",
  "userId": 1
}

Error Response (401):
{
  "message": "Invalid or expired token"
}
```

---

## Reservation Endpoints (`/api/reservations`)

### 1. Get User's Reservations ✅ PROTECTED
```
GET /api/reservations
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Success Response (200):
[
  {
    "id": 1,
    "user_id": 1,
    "slot_id": 5,
    "slot_number": 105,
    "vehicle_plate": "ABC123",
    "check_in_time": "2024-03-04T10:30:00Z",
    "check_out_time": null,
    "status": "active",
    "amount_paid": null,
    "created_at": "2024-03-04T10:30:00Z"
  },
  {
    "id": 2,
    "user_id": 1,
    "slot_id": 3,
    "slot_number": 103,
    "vehicle_plate": "XYZ789",
    "check_in_time": "2024-03-03T14:00:00Z",
    "check_out_time": "2024-03-03T16:30:00Z",
    "status": "completed",
    "amount_paid": 25.00,
    "created_at": "2024-03-03T14:00:00Z"
  }
]
```

### 2. Create Parking Reservation ✅ PROTECTED
```
POST /api/reservations
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

Request Body:
{
  "slotId": 5,
  "vehiclePlate": "ABC123"
}

Success Response (201):
{
  "message": "Reservation created successfully",
  "reservation": {
    "id": 1,
    "user_id": 1,
    "slot_id": 5,
    "vehicle_plate": "ABC123",
    "check_in_time": "2024-03-04T10:30:00Z",
    "check_out_time": null,
    "status": "active",
    "created_at": "2024-03-04T10:30:00Z"
  }
}

Error Response (404):
{
  "message": "Parking slot not found"
}

Error Response (409):
{
  "message": "Parking slot is not available"
}
```

### 3. End Parking Session ✅ PROTECTED
```
PUT /api/reservations/1/end
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Success Response (200):
{
  "message": "Reservation ended successfully",
  "reservation": {
    "id": 1,
    "user_id": 1,
    "slot_id": 5,
    "vehicle_plate": "ABC123",
    "check_in_time": "2024-03-04T10:30:00Z",
    "check_out_time": "2024-03-04T12:30:00Z",
    "status": "completed",
    "updated_at": "2024-03-04T12:30:00Z"
  }
}

Note: Automatically adds entry to parking_history table
```

### 4. Cancel Parking Reservation ✅ PROTECTED
```
PUT /api/reservations/1/cancel
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Success Response (200):
{
  "message": "Reservation cancelled successfully",
  "reservation": {
    "id": 1,
    "user_id": 1,
    "slot_id": 5,
    "status": "cancelled",
    "updated_at": "2024-03-04T12:30:00Z"
  }
}

Error Response (409):
{
  "message": "Only active reservations can be cancelled"
}
```

### 5. Get Parking History ✅ PROTECTED
```
GET /api/reservations/history/all
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Success Response (200):
[
  {
    "id": 1,
    "user_id": 1,
    "slot_number": 105,
    "vehicle_plate": "ABC123",
    "check_in": "2024-03-03T10:00:00Z",
    "check_out": "2024-03-03T12:30:00Z",
    "duration_minutes": 150,
    "amount_paid": 15.00,
    "created_at": "2024-03-03T12:30:00Z"
  },
  {
    "id": 2,
    "user_id": 1,
    "slot_number": 103,
    "vehicle_plate": "XYZ789",
    "check_in": "2024-03-02T14:00:00Z",
    "check_out": "2024-03-02T16:30:00Z",
    "duration_minutes": 150,
    "amount_paid": 15.00,
    "created_at": "2024-03-02T16:30:00Z"
  }
]
```

---

## Parking Slots Endpoints (`/api/slots`) - From Member 2

### 1. Get All Parking Slots
```
GET /api/slots

Success Response (200):
[
  {
    "id": 1,
    "number": 101,
    "status": "free",
    "last_updated": "2024-03-04T10:30:00Z"
  },
  {
    "id": 2,
    "number": 102,
    "status": "occupied",
    "last_updated": "2024-03-04T10:15:00Z"
  },
  {
    "id": 3,
    "number": 103,
    "status": "free",
    "last_updated": "2024-03-04T09:45:00Z"
  }
]
```

### 2. Get Specific Parking Slot
```
GET /api/slots/101

Success Response (200):
{
  "id": 1,
  "number": 101,
  "status": "free",
  "last_updated": "2024-03-04T10:30:00Z"
}

Error Response (404):
{
  "message": "Slot not found"
}
```

### 3. Create Parking Slot
```
POST /api/slots
Content-Type: application/json

Request Body:
{
  "number": 104,
  "status": "free"
}

Success Response (201):
{
  "id": 4,
  "number": 104,
  "status": "free",
  "last_updated": "2024-03-04T10:30:00Z"
}
```

### 4. Delete Parking Slot
```
DELETE /api/slots/104

Success Response (200):
{
  "message": "Slot deleted successfully"
}

Error Response (404):
{
  "message": "Slot not found"
}
```

---

## HTTP Status Codes Reference

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid/missing required fields |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | User not authorized for action |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource state conflict (slot occupied, email exists) |
| 500 | Server Error | Database or server error |

---

## Authentication Header Format

All protected endpoints require:
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

Example with cURL:
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA5NTQ3NjAwLCJleHAiOjE3MDk2MzQwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
```

---

## Common cURL Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "john_doe",
    "password": "password123",
    "fullName": "John Doe",
    "phone": "+1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Profile (save token from login response first)
```bash
TOKEN="your_token_here"
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Create Reservation
```bash
TOKEN="your_token_here"
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "slotId": 1,
    "vehiclePlate": "ABC123"
  }'
```

### End Parking Session
```bash
TOKEN="your_token_here"
curl -X PUT http://localhost:5000/api/reservations/1/end \
  -H "Authorization: Bearer $TOKEN"
```

### Get Parking History
```bash
TOKEN="your_token_here"
curl -X GET http://localhost:5000/api/reservations/history/all \
  -H "Authorization: Bearer $TOKEN"
```

### List All Parking Slots
```bash
curl -X GET http://localhost:5000/api/slots
```

---

## Error Response Examples

### Missing Required Field
```json
{
  "message": "Email, username, and password are required"
}
```

### Duplicate Email
```json
{
  "message": "Email already registered"
}
```

### Invalid Credentials
```json
{
  "message": "Invalid email or password"
}
```

### No Token Provided
```json
{
  "message": "No token provided"
}
```

### Token Expired
```json
{
  "message": "Invalid or expired token"
}
```

### Slot Not Available
```json
{
  "message": "Parking slot is not available"
}
```

### User Not Authorized
```json
{
  "message": "You are not authorized to end this reservation"
}
```

---

## Request/Response Content Types

All endpoints use:
- **Content-Type:** `application/json`
- **Accept:** `application/json`

---

## Token Information

- **Type:** JWT (JSON Web Token)
- **Algorithm:** HS256 (HMAC SHA-256)
- **Expiry:** 24 hours from issuance
- **Payload:** { id, email, username }
- **Secret:** Configured via JWT_SECRET environment variable

---

**Last Updated:** March 4, 2024
**Version:** 1.0.0
**API Status:** ✅ Production Ready
