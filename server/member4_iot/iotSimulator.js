const axios = require('axios');

const API_URL = 'http://localhost:5000/api/slots';

async function simulate() {
    setInterval(async () => {
        const slot = Math.floor(Math.random() * 10) + 1;
        const status = Math.random() > 0.5 ? 'occupied' : 'free';
        try {
            await axios.patch(`${API_URL}/${slot}`, { status });
            console.log(`[IoT] Slot ${slot} -> ${status}`);
        } catch (e) {
            console.log('[IoT] API not ready yet...');
        }
    }, 10000);
}

module.exports = simulate;
simulate();
