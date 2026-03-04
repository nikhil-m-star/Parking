import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

const AnimatedRoutes = ({ children }) => {
    const location = useLocation();
    return <div key={location.pathname}>{children}</div>;
};

const Home = () => (
    <div className="editorial-grid">
        <div className="content-column">
            <div className="fade-up delay-1">
                <span className="badge">Elite Intelligence</span>
            </div>
            <h1 className="fade-up delay-2">Smart<br /><span className="gradient-text">Parking</span></h1>
            <p className="hero-text fade-up delay-3">Redefine your arrival. Experience flawless precision and breathtaking efficiency with our real-time telemetry network.</p>
            <div className="nav-buttons fade-up delay-4">
                <Link to="/dashboard" className="btn primary-btn">Launch System</Link>
                <Link to="/admin" className="btn secondary">Admin Access</Link>
            </div>
        </div>
        <div className="image-column fade-up delay-2">
            <div className="image-overlay"></div>
            <img
                src="/ethereal_luxury_parking.png"
                alt="Elite Ethereal Parking"
                className="hero-image"
            />
        </div>
    </div>
);

const Dashboard = () => (
    <div className="dashboard-container">
        <div className="section-header fade-up delay-1">
            <h2 className="gradient-text">Live Telemetry</h2>
            <p>Real-time slot tracking with absolute precision.</p>
        </div>
        <div className="glass-panel fade-up delay-2">
            <div className="slot-grid">
                <div className="slot free fade-up delay-1">
                    <div className="slot-header">
                        <span className="slot-id">01</span>
                        <div className="slot-icon"></div>
                    </div>
                    <div className="slot-body">
                        <span className="status">Available Space</span>
                    </div>
                </div>
                <div className="slot occupied fade-up delay-2">
                    <div className="slot-header">
                        <span className="slot-id">02</span>
                        <div className="slot-icon"></div>
                    </div>
                    <div className="slot-body">
                        <span className="status">Occupied</span>
                    </div>
                </div>
                <div className="slot free fade-up delay-3">
                    <div className="slot-header">
                        <span className="slot-id">03</span>
                        <div className="slot-icon"></div>
                    </div>
                    <div className="slot-body">
                        <span className="status">Available Space</span>
                    </div>
                </div>
                <div className="slot occupied fade-up delay-4">
                    <div className="slot-header">
                        <span className="slot-id">04</span>
                        <div className="slot-icon"></div>
                    </div>
                    <div className="slot-body">
                        <span className="status">Occupied</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Admin = () => (
    <div className="admin-container">
        <div className="section-header fade-up delay-1">
            <h2 className="gradient-text">System Core</h2>
            <p>Advanced routing and architectural diagnostics.</p>
        </div>
        <div className="glass-panel diagnostic-panel fade-up delay-2">
            <h3 style={{ color: 'var(--c-cyan)', letterSpacing: '0.2em', fontWeight: 600 }}>ALL SYSTEMS NOMINAL</h3>
        </div>
    </div>
);

function App() {
    return (
        <Router>
            <div className="noise-overlay"></div>
            <div className="app-container">
                <nav className="navbar fade-up">
                    <Link to="/" className="logo">Smart<span>Park</span></Link>
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
