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

const { initDb } = require('./member3_db/db');

// Start IoT Simulator (Member 4)
const startSimulator = require('./member4_iot/iotSimulator.js');
startSimulator();

// Basic Route
app.get('/', (req, res) => {
    res.send('Smart Parking System API is running...');
});

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

// Connect to Neon/PostgreSQL
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.warn('WARNING: DATABASE_URL is not defined in .env');
}

initDb().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
});
