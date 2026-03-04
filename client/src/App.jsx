import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

// Re-apply animations on route change smoothly
const AnimatedRoutes = ({ children }) => {
    const location = useLocation();
    return <div key={location.pathname}>{children}</div>;
};

const Home = () => (
    <div className="editorial-grid">
        <div className="content-column">
            <span className="badge fade-up delay-1">The Architecture of Arrival</span>
            <h1 className="fade-up delay-1">Smart<span className="gold-text">Park</span></h1>
            <p className="hero-text fade-up delay-2">Transcend the ordinary search. Experience an elegant, frictionless arrival with our sovereign real-time slot intelligence.</p>
            <div className="nav-buttons fade-up delay-3">
                <Link to="/dashboard" className="btn gold-btn">Enter Dashboard</Link>
                <Link to="/admin" className="btn secondary">System Operations</Link>
            </div>
        </div>
        <div className="image-column fade-up delay-2">
            <div className="image-overlay"></div>
            <img
                src="/ethereal_luxury_parking.png"
                alt="Ethereal Architectural Luxury Parking"
                className="hero-image"
            />
        </div>
    </div>
);

const Dashboard = () => (
    <div className="dashboard-container">
        <div className="section-header fade-up delay-1">
            <h2 className="gold-text">Live Availability</h2>
            <p>Real-time slot telemetry for seamless arrival.</p>
        </div>
        <div className="glass-panel fade-up delay-2">
            <div className="slot-grid">
                {/* Slots will be mapped here */}
                <div className="slot free fade-up delay-1">
                    <div className="slot-ring"></div>
                    <span className="slot-id">01</span>
                    <span className="status">Available</span>
                </div>
                <div className="slot occupied fade-up delay-2">
                    <div className="slot-ring occupied"></div>
                    <span className="slot-id">02</span>
                    <span className="status">Occupied</span>
                </div>
                <div className="slot free fade-up delay-3">
                    <div className="slot-ring"></div>
                    <span className="slot-id">03</span>
                    <span className="status">Available</span>
                </div>
                <div className="slot occupied fade-up delay-4">
                    <div className="slot-ring occupied"></div>
                    <span className="slot-id">04</span>
                    <span className="status">Occupied</span>
                </div>
            </div>
        </div>
    </div>
);

const Admin = () => (
    <div className="admin-container">
        <div className="section-header fade-up delay-1">
            <h2 className="gold-text">Operations</h2>
            <p>High-level system oversight and architectural control.</p>
        </div>
        <div className="glass-panel diagnostic-panel fade-up delay-2">
            <div className="scanner-line"></div>
            <p className="diagnostic-text">DIAGNOSTICS ONLINE</p>
        </div>
    </div>
);

function App() {
    return (
        <Router>
            <div className="noise-overlay"></div>
            <div className="app-container">
                <nav className="navbar fade-up">
                    <Link to="/" className="logo">Smart<span className="gold-text">Park</span></Link>
                    <div className="links">
                        <Link to="/">Home</Link>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/admin">Admin</Link>
                    </div>
                </nav>

                <AnimatedRoutes>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                </AnimatedRoutes>
            </div>
        </Router>
    );
}

export default App;
