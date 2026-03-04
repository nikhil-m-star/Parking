import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

const Home = () => (
    <div className="bento-grid">
        <div className="bento-item hero-main">
            <span className="badge">100% Brutal</span>
            <h1>SMART<br />PARKING</h1>
            <p className="hero-text">Real-time slot detection, raw data, aggressive efficiency. Stop circling, start parking.</p>
            <div className="nav-buttons">
                <Link to="/dashboard" className="btn">DASHBOARD -&gt;</Link>
                <Link to="/admin" className="btn secondary">ADMIN PANEL</Link>
            </div>
        </div>
        <div className="bento-item hero-side">
            <h2 style={{ fontSize: '3rem' }}>0%</h2>
            <p style={{ fontWeight: 900, fontSize: '1.2rem', margin: '10px 0' }}>WASTED TIME</p>
        </div>
        <div className="bento-item hero-image">
            <img
                src="/neo_brutalist_parking.png"
                alt="Neo-Brutalist Isometric Parking Garage"
            />
        </div>
    </div>
);

const Dashboard = () => (
    <div className="bento-grid">
        <div className="bento-item" style={{ gridColumn: 'span 12', backgroundColor: 'var(--brutal-yellow)' }}>
            <h1>Dashboard</h1>
            <p style={{ fontWeight: 600, fontSize: '1.5rem', margin: 0 }}>LIVE FEED // ZONE ALPHA</p>
        </div>
        <div className="bento-item slot-container">
            <div className="slot-grid">
                {/* Slots will be mapped here */}
                <div className="slot free">P-01<br /><span style={{ fontSize: '1rem', display: 'block', marginTop: '10px' }}>FREE</span></div>
                <div className="slot occupied">P-02<br /><span style={{ fontSize: '1rem', display: 'block', marginTop: '10px' }}>TAKEN</span></div>
                <div className="slot free">P-03<br /><span style={{ fontSize: '1rem', display: 'block', marginTop: '10px' }}>FREE</span></div>
                <div className="slot occupied">P-04<br /><span style={{ fontSize: '1rem', display: 'block', marginTop: '10px' }}>TAKEN</span></div>
            </div>
        </div>
    </div>
);

const Admin = () => (
    <div className="bento-grid">
        <div className="bento-item" style={{ gridColumn: 'span 12', backgroundColor: 'var(--brutal-pink)' }}>
            <h1 style={{ color: '#fff' }}>Root Access</h1>
            <p style={{ color: '#fff', fontWeight: 600, fontSize: '1.5rem', margin: 0 }}>SYSTEM DIAGNOSTICS & CONTROL</p>
        </div>
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
