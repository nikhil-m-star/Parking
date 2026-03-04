import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

const Home = () => (
    <div className="glass-card">
        <h1>Smart Parking System</h1>
        <p>Find and book parking slots in real-time.</p>
        <div className="nav-buttons">
            <Link to="/dashboard" className="btn">View Dashboard</Link>
            <Link to="/admin" className="btn secondary">Admin Panel</Link>
        </div>
    </div>
);

const Dashboard = () => (
    <div className="glass-card">
        <h1>Parking Dashboard</h1>
        <p>Real-time slot availability will appear here.</p>
        <div className="slot-grid">
            {/* Slots will be mapped here */}
            <div className="slot free">Slot 1: Free</div>
            <div className="slot occupied">Slot 2: Occupied</div>
        </div>
    </div>
);

const Admin = () => (
    <div className="glass-card">
        <h1>Admin Panel</h1>
        <p>Manage parking locations and view analytics.</p>
    </div>
);

function App() {
    return (
        <Router>
            <div className="app-container">
                <nav className="navbar">
                    <Link to="/" className="logo">SmartPark</Link>
                    <div className="links">
                        <Link to="/">Home</Link>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/admin">Admin</Link>
                    </div>
                </nav>

                <main className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
