const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { verifyToken, generateToken } = require('./authMiddleware');
const {
  getUserByEmail,
  getUserById,
  createUser
} = require('./db');

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, fullName, phone } = req.body;

    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Email, username, and password are required' });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await createUser(email, username, passwordHash, fullName || null, phone || null);

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        fullName: newUser.full_name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Get user
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
        phone: user.phone,
        vehiclePlate: user.vehicle_plate
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get Current User Profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.full_name,
        phone: user.phone,
        vehiclePlate: user.vehicle_plate,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
});

// Update User Profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { fullName, phone, vehiclePlate } = req.body;
    const { sql } = require('./db');

    const result = await sql`
      UPDATE users 
      SET full_name = ${fullName}, phone = ${phone}, vehicle_plate = ${vehiclePlate}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.userId}
      RETURNING id, email, username, full_name, phone, vehicle_plate
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: result[0].id,
        email: result[0].email,
        username: result[0].username,
        fullName: result[0].full_name,
        phone: result[0].phone,
        vehiclePlate: result[0].vehicle_plate
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Verify Token
router.post('/verify', verifyToken, (req, res) => {
  res.json({ message: 'Token is valid', userId: req.userId });
});

module.exports = router;
