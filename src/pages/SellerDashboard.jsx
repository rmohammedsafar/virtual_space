import React from 'react';
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h2><span className="text-gradient">Quick Space</span> Seller Dashboard</h2>
        <Link to="/" className="btn-secondary">Logout</Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>My Properties</h3>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <strong>Downtown Office Hub</strong> - 15 Active Renters
            </li>
            <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <strong>Tech Park Suite</strong> - 4 Active Renters
            </li>
          </ul>
          <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>+ List New Space</button>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>Earnings (This Month)</h3>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            $4,250
          </div>
          <p style={{ color: '#27c93f' }}>+12% from last month</p>
          <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Withdraw Funds</button>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>Action Required</h3>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ padding: '10px 0', color: '#ffbd2e' }}>
              Upload mail scans for 3 users (Tech Park Suite).
            </li>
            <li style={{ padding: '10px 0', color: '#ff5f56' }}>
              Confirm meeting room booking for Acme Innovations.
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default SellerDashboard;
