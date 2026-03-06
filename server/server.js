require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/slots', require('./member2_api/slotRoutes.js'));
app.use('/api/auth', require('./member3_db/authRoutes.js'));
app.use('/api/reservations', require('./member3_db/reservationRoutes.js'));

const { initDb } = require('./member3_db/db');
const configureSocketIO = require('./member3_db/socketIO');

// Configure Socket.io for real-time parking events
const socketIOHelpers = configureSocketIO(io);

// Start IoT Simulator (Member 4)
const startSimulator = require('./member4_iot/iotSimulator.js');
startSimulator();

// Basic Route
app.get('/', (req, res) => {
    res.send('Smart Parking System API is running...');
});

// Expose socket.io helpers globally for use in routes
app.locals.socketIOHelpers = socketIOHelpers;

const PORT = process.env.PORT || 5000;

// Connect to Neon/PostgreSQL (Non-blocking for Vercel)
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('CRITICAL: DATABASE_URL is not defined in environment variables.');
}

// In development, initialize the database and start the server
if (process.env.NODE_ENV !== 'production') {
    const initDbPromise = initDb().catch(err => {
        console.warn('⚠️  Database initialization warning:', err.message);
        console.warn('Server will run but database features unavailable. Add DATABASE_URL to .env');
    });

    // Start server regardless of database status
    Promise.resolve(initDbPromise).then(() => {
        server.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
            console.log(`📡 Socket.io listening on /parking`);
            console.log(`\n🔗 http://localhost:${PORT}`);
        });
    });
} else {
    // In production (Vercel), we just initialize the DB. Vercel handles the listening.
    initDb().catch(err => console.error('Delayed DB init failed:', err));
}

// Export the app for Vercel
module.exports = app;
