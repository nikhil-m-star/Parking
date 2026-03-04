import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

const Home = () => (
    <div className="editorial-grid">
        <div className="content-column">
            <span className="badge">The Architecture of Arrival</span>
            <h1>Smart<span>Park</span></h1>
            <p className="hero-text">Transcend the ordinary search. Experience an elegant, frictionless arrival with our sovereign real-time slot intelligence.</p>
            <div className="nav-buttons">
                <Link to="/dashboard" className="btn">Enter Dashboard</Link>
                <Link to="/admin" className="btn secondary">System Operations</Link>
            </div>
        </div>
        <div className="image-column">
            <img
                src="/ethereal_luxury_parking.png"
                alt="Ethereal Architectural Luxury Parking"
                className="hero-image"
            />
        </div>
    </div>
);

const Dashboard = () => (
    <div>
        <div className="section-header">
            <h2>Live Availability</h2>
            <p>Real-time slot telemetry for seamless arrival.</p>
        </div>
        <div className="glass-panel">
            <div className="slot-grid">
                {/* Slots will be mapped here */}
                <div className="slot free"><span className="slot-id">01</span><span className="status">Available</span></div>
                <div className="slot occupied"><span className="slot-id">02</span><span className="status">Occupied</span></div>
                <div className="slot free"><span className="slot-id">03</span><span className="status">Available</span></div>
                <div className="slot occupied"><span className="slot-id">04</span><span className="status">Occupied</span></div>
            </div>
        </div>
    </div>
);

const Admin = () => (
    <div>
        <div className="section-header">
            <h2>Operations</h2>
            <p>High-level system oversight and architectural control.</p>
        </div>
        <div className="glass-panel" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>DIAGNOSTICS ONLINE</p>
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

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
