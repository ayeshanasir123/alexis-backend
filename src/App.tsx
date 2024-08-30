// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Offers from './components/Offers';
import Posts from './components/Posts';

const AppContent: React.FC = () => {
    const location = useLocation();

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {location.pathname !== '/' && <NavBar />}
            <div style={{ flexGrow: 1 }}>
                <Header />
                <div style={{ padding: '20px', backgroundColor: '#f0f2f5', height: 'calc(100vh - 150px)', overflowY: 'auto' }}>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/posts" element={<Posts />} />
                        <Route path="/offers" element={<Offers />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
