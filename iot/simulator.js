const axios = require('axios');

const API_URL = 'http://localhost:5000/api/slots';

// Simulate a sensor detecting a car
async function toggleSlotStatus(slotNumber, status) {
    try {
        const response = await axios.patch(`${API_URL}/${slotNumber}`, { status });
        console.log(`Slot ${slotNumber} is now ${status}`);
    } catch (error) {
        console.error('Error updating slot:', error.message);
    }
}

// Example: Every 10 seconds, toggle a random slot for demo purposes
setInterval(() => {
    const slot = Math.floor(Math.random() * 10) + 1;
    const status = Math.random() > 0.5 ? 'occupied' : 'free';
    toggleSlotStatus(slot, status);
}, 10000);

console.log('IoT Simulator started...');
