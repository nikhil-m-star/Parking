import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

const GalleryRoutes = ({ children }) => {
    const location = useLocation();

    // Smooth scroll to top on route change to enhance the "installation" feel
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]);

    return <div key={location.pathname} className="view-container">{children}</div>;
};

const Experience = () => (
    <div className="home-content">
        <h1 className="huge-title">
            The Stillness<br />
            <span className="italic-accent">of Space.</span>
        </h1>
        <p className="poetic-text">
            Abandon the search. We monitor the absolute void, identifying where your vehicle belongs in the temporal architecture of the city.
        </p>
        <div className="abstract-action-list">
            <Link to="/dashboard" className="abstract-link"><span></span> Observe Availability</Link>
            <Link to="/admin" className="abstract-link"><span></span> System Oversight</Link>
        </div>
    </div>
);

const Observatory = () => (
    <>
        <h1 className="huge-title" style={{ fontSize: '4vw' }}>
            Live Observatory.
        </h1>
        <p className="poetic-text" style={{ marginBottom: '4vh' }}>
            A curated reflection of occupied geometries and empty voids.
        </p>

        <div className="art-grid">
            {/* Instead of boxes, we use massive typography lines */}
            <div className="art-slot free">
                <div className="slot-number">01.</div>
                <div className="slot-state">Vacant Form</div>
            </div>

            <div className="art-slot occupied">
                <div className="slot-number">02.</div>
                <div className="slot-state">Matter Present</div>
            </div>

            <div className="art-slot free">
                <div className="slot-number">03.</div>
                <div className="slot-state">Vacant Form</div>
            </div>

            <div className="art-slot occupied">
                <div className="slot-number">04.</div>
                <div className="slot-state">Matter Present</div>
            </div>
        </div>
    </>
);

const Oversight = () => (
    <div className="admin-view">
        <h1 className="admin-title">Oversight</h1>
        <div className="admin-status">
            The architecture is listening.
        </div>
    </div>
);

function App() {
    return (
        <Router>
            <div className="gallery-spotlight"></div>

            <div className="app-container">
                <nav className="gallery-nav">
                    <Link to="/" className="gallery-logo">Smt.Prk</Link>
                    <div className="gallery-links">
                        <Link to="/">Manifesto</Link>
                        <Link to="/dashboard">Observatory</Link>
                        <Link to="/admin">Oversight</Link>
                    </div>
                </nav>

                <GalleryRoutes>
                    <Routes>
                        <Route path="/" element={<Experience />} />
                        <Route path="/dashboard" element={<Observatory />} />
                        <Route path="/admin" element={<Oversight />} />
                    </Routes>
                </GalleryRoutes>
            </div>
        </Router>
    );
}

export default App;
