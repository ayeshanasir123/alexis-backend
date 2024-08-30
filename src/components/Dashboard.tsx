// src/pages/Dashboard.tsx
import React from 'react';
import NavBar from '../components/NavBar';
import Header from '../components/Header';

const Dashboard: React.FC = () => {
    return (
        <div style={{ display: 'flex' }}>
            <NavBar />
            <div style={{ flexGrow: 1 }}>
                <Header />
                <main style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
                    <h1>Dashboard</h1>
                    {/* Additional content goes here */}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
