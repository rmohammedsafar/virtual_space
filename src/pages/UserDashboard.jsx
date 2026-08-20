import React from 'react';
import { Link } from 'react-router-dom';
import '../components/Features.css';

const UserDashboard = () => {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h2><span className="text-gradient">Quick Space</span> User Dashboard</h2>
        <Link to="/" className="btn-secondary">Logout</Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>My Active Space</h3>
          <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Acme Innovations LLC<br/>
            123 Innovation Drive, Suite 400<br/>
            Silicon Valley, CA 94043
          </div>
          <span className="badge" style={{ background: 'rgba(39, 201, 63, 0.2)', color: '#27c93f', border: '1px solid #27c93f' }}>Active - Professional Plan</span>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>Digital Mailroom</h3>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <strong>IRS Notice</strong> - Received Today <button style={{ float: 'right', background: 'none', color: 'var(--color-primary)', border: 'none', cursor: 'pointer' }}>View Scan</button>
            </li>
            <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <strong>Bank Statement</strong> - Yesterday <button style={{ float: 'right', background: 'none', color: 'var(--color-primary)', border: 'none', cursor: 'pointer' }}>View Scan</button>
            </li>
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>Billing Overview</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Next payment of $79 due on Sept 1st.</p>
          <button className="btn-primary" style={{ width: '100%' }}>Manage Payment Methods</button>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
