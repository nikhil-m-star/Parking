# Socket.io Integration - Quick Reference

## What's New

✅ **socketIO.js** - Complete Socket.io event handler  
✅ **server.js** - Integrated Socket.io with routes  
✅ **SOCKETIO_GUIDE.md** - Comprehensive Socket.io documentation

---

## Real-Time Events Added

### 🔌 Connection
- `user:join` - Authenticate user in Socket.io
- `connection:success` - User joined successfully
- `disconnect` - User disconnected

### 🅿️ Parking Slots (Real-Time)
- `slots:getAll` - Get all slots
- `slots:watch` - Start watching slot updates
- `slots:updated` - Receive slot changes
- `slots:occupied` - Slot occupied broadcast
- `slots:freed` - Slot freed broadcast

### 📅 Reservations (Real-Time)
- `reservations:getUser` - Get user's bookings
- `reservations:create` - Create reservation
- `reservations:end` - End parking session

### 📊 Statistics (Real-Time)
- `stats:get` - Get current occupancy
- `stats:watch` - Watch occupancy changes
- `stats:updated` - Occupancy update broadcast

### 🔔 Notifications
- `notifications:subscribe` - Subscribe to alerts
- `notification` - Receive notification

### 👨‍💼 Admin
- `admin:watchReservations` - Monitor all bookings
- `admin:reservationNew` - New booking alert

---

## Usage Example (React)

```javascript
import io from 'socket.io-client';

// Connect
const socket = io('http://localhost:5000/parking');

// Authenticate
socket.emit('user:join', {
  userId: 1,
  email: 'user@example.com',
  username: 'john_doe'
});

// Watch slots
socket.emit('slots:watch');
socket.on('slots:updated', (data) => {
  console.log('Slot updated:', data);
});

// Create reservation
socket.emit('reservations:create', {
  slotId: 5,
  vehiclePlate: 'ABC123'
});

// Listen for success
socket.on('reservations:created', (data) => {
  console.log('Reservation created:', data.reservation);
});

// Get live stats
socket.emit('stats:watch');
socket.on('stats:updated', (data) => {
  console.log(`Free: ${data.freeSlots}/${data.totalSlots}`);
});
```

---

## Files Modified

### server.js
```javascript
// ADDED:
const configureSocketIO = require('./member3_db/socketIO');
const socketIOHelpers = configureSocketIO(io);
app.locals.socketIOHelpers = socketIOHelpers;
```

### New: socketIO.js
- 400+ lines of real-time event handlers
- Comprehensive event management
- Error handling & logging

---

## Key Features

✅ **Real-Time Slot Updates** - See availability instantly  
✅ **Live Reservations** - Create/end bookings in real-time  
✅ **Occupancy Monitoring** - Watch parking occupancy %  
✅ **Admin Alerts** - Monitor all bookings  
✅ **User Notifications** - Targeted notifications  
✅ **Error Handling** - Proper error messages  
✅ **Scalable Architecture** - Room-based broadcasting  

---

## Integration with Frontend

### Step 1: Install Socket.io Client
```bash
npm install socket.io-client
```

### Step 2: Connect in React Component
```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000/parking');
    
    newSocket.emit('user:join', {
      userId: user.id,
      email: user.email,
      username: user.username
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  return (
    // Your component
  );
}
```

### Step 3: Listen to Events
```javascript
useEffect(() => {
  if (!socket) return;

  socket.on('slots:updated', (data) => {
    // Update UI
  });

  socket.on('notification', (data) => {
    // Show notification
  });

  return () => {
    socket.off('slots:updated');
    socket.off('notification');
  };
}, [socket]);
```

---

## Event Flow

```
Frontend              Socket.io            Backend            Database
   |                    |                    |                   |
   |--user:join-------->|                    |                   |
   |                    |--authenticate---->|                   |
   |<----success--------|                    |                   |
   |                    |                    |                   |
   |--slots:watch----->|                    |                   |
   |                    |--setup room------>|                   |
   |<----watching------|                    |                   |
   |                    |                    |                   |
   |  (other client)    |                    |                   |
   |           -----reservations:create---->|                   |
   |                    |                    |--check avail.---->|
   |                    |                    |<--slot free-------| 
   |                    |                    |--create resv.---->|
   |                    |<--broadcast--------|<--success---------|
   |<----slots:occupied-|                    |                   |
   |<----slots:occupied-|                    |                   |
   |<----stats:updated--|                    |                   |
```

---

## Performance

- **Room-based broadcasting** prevents redundant emissions
- **User-specific rooms** ensure isolation
- **Namespace separation** for organized events
- **Connection pooling** for database efficiency
- **Memory-efficient** Socket.io connection management

---

## Testing Socket.io

### Using Socket.io Test Client
```html
<script src="https://cdn.socket.io/4.8.3/socket.io.min.js"></script>
<script>
  const socket = io('http://localhost:5000/parking');
  
  socket.emit('user:join', {
    userId: 1,
    email: 'test@example.com',
    username: 'testuser'
  });

  socket.on('connection:success', (data) => {
    console.log('Connected!', data);
  });

  // Get slots
  socket.emit('slots:getAll');
  socket.on('slots:all', (data) => {
    console.log('Slots:', data.slots);
  });
</script>
```

---

## Troubleshooting

**Connection fails:**
- Check server running on correct port (5000)
- Verify Socket.io package installed
- Check CORS settings

**Events not received:**
- Ensure user:join emitted after connection
- Check event names (case-sensitive)
- Verify socket still connected

**Real-time updates slow:**
- Check database query performance
- Monitor active connections
- Check network latency

---

## Next Steps

1. ✅ Socket.io configured in server.js
2. 🔄 Install socket.io-client in React frontend
3. 🔄 Create React components with Socket.io
4. 🔄 Build UI for real-time updates
5. 🚀 Deploy to production

---

## Documentation

For complete Socket.io details, see **SOCKETIO_GUIDE.md**

All events, examples, and best practices documented there!

---

**Status:** ✅ Complete & Ready for Frontend Integration

Socket.io now provides real-time, two-way communication for the entire parking system!
