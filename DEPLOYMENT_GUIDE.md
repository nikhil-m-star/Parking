# Vercel Deployment Guide: Smart Parking System

This guide walks you through the process of deploying both the **Frontend (client)** and the **Backend (server)** to Vercel.

---

## 1. Backend Deployment (Node.js/Express)

### Step A: Prepare the Code
- Ensure `server/vercel.json` exists with the correct configuration.
- Your `server/server.js` must export the app or be the entry point.
- Ensure all dependencies are in `server/package.json`.

### Step B: Deploy to Vercel
1. Navigate to [vercel.com](https://vercel.com) and click **"Add New"** -> **"Project"**.
2. Connect your GitHub repository.
3. Select the **`server`** folder as the root directory.
4. **Environment Variables**: Add your `MONGODB_URI` and any other secrets (like `JWT_SECRET`) in the Vercel dashboard settings for this project.
5. Click **Deploy**.

---

## 2. Frontend Deployment (React/Vite)

### Step A: Prepare the Code
- Ensure `client/vercel.json` exists to handle client-side routing.
- Update any API URLs in your React code to point to the **deployed production URL** of your backend (from Step 1).

### Step B: Deploy to Vercel
1. Create a **separately** managed project on Vercel for the frontend.
2. Select the **`client`** folder as the root directory.
3. Vercel should automatically detect **Vite** as the framework.
4. **Environment Variables**: Add `VITE_API_URL` (pointing to your server URL) if you are using environment variables for the API.
5. Click **Deploy**.

---

## 3. Post-Deployment Checklist
- **CORS**: Ensure your backend `server/server.js` allows requests from your new frontend Vercel URL.
- **Database**: Ensure your MongoDB cluster (e.g., MongoDB Atlas) has whitelisted the IP addresses for Vercel (or set it to `0.0.0.0/0` for initial testing).
- **Verify**: Open your frontend URL, check the console for any connection errors, and verify that the IoT simulator (running locally or elsewhere) can still push data to the production backend.

---

## Folder Locations for Reference:
- **Client Config**: [client/vercel.json](file:///Users/nikhilm/Desktop/Programming/Web Dev/Parking/client/vercel.json)
- **Server Config**: [server/vercel.json](file:///Users/nikhilm/Desktop/Programming/Web Dev/Parking/server/vercel.json)
