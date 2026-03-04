# Team Work Division: Smart Parking System

This document outlines the specific responsibilities and folder locations for each of the 4 team members. The project is structured to ensure isolation and minimize merge conflicts.

---

## Member 1: Frontend Developer
**Primary Folder**: `client/`
**Role**: Lead the visual identity and user experience.

### Responsibilities:
- **UI/UX Design**: Maintain and expand the glassmorphism design system in `client/src/App.css`.
- **Navigation & Routing**: Manage `client/src/App.jsx` and ensure smooth transitions between views.
- **User Dashboard**: Build interactive parking maps and real-time slot status components.
- **Admin Interface**: Create the UI for monitoring occupancy and managing parking zones.
- **API Integration**: Use `axios` to fetch data from the Backend API (Member 2).
- **Vercel Frontend**: Manage `client/vercel.json` for frontend deployment.

---

## Member 2: Backend API Developer
**Primary Folder**: `server/member2_api/`
**Role**: Develop the core RESTful API and routing logic.

### Responsibilities:
- **API Endpoints**: Maintain `server/member2_api/slotRoutes.js` and add new routes for bookings and users.
- **Controller Logic**: Create controllers to handle business logic (e.g., "Can this user book this slot?").
- **Error Handling**: Implement standardized error responses for the API.
- **Documentation**: Keep a record of all available API endpoints for Member 1.
- **Server Entry**: Coordinate with others on `server/server.js` to register new routes.

---

## Member 3: Database & Auth Developer
**Primary Folder**: `server/member3_db/`
**Role**: Manage data persistence, security, and real-time communication.

### Responsibilities:
- **Schema Design**: Maintain `server/member3_db/db.js` and create SQL table definitions for `ParkingSlots`, `Users`, and `Bookings`.
- **Authentication**: Implement JWT (JSON Web Token) login and protected routes.
- **WebSockets**: Utilize `Socket.io` in the main server to push live updates to the frontend.
- **Data Seeding**: Create SQL insertion scripts to populate the database.
- **Neon/Postgres**: Manage the `DATABASE_URL` and connection pooling.

---

## Member 4: IoT & System Logic Developer
**Primary Folder**: `server/member4_iot/`
**Role**: Simulate "Smart" hardware and implement system-wide analytics.

### Responsibilities:
- **Hardware Simulation**: Maintain `server/member4_iot/iotSimulator.js` (Simulates car arrivals/departures).
- **Admin Analytics**: Build backend logic to calculate occupancy rates, peak hours, and revenue.
- **System Integration**: Ensure the "IoT data" flows correctly through the API to the Database and finally the Frontend.
- **Testing**: Conduct integration tests between the backend folders.
- **Hosting Config**: Assist with backend deployment on Vercel using `server/vercel.json`.

---

## Technology Stack
- **Frontend**: Vite + React + Vanilla CSS (Glassmorphism)
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Deployment**: Vercel
