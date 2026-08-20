import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [approvals, setApprovals] = useState([
    { id: 1, type: 'New Space Listing', name: 'Miami Beach Front' },
    { id: 2, type: 'Seller Application', name: 'Global Spaces Inc.' }
  ]);

  const handleAction = (id, action) => {
    alert(`${action} successful!`);
    setApprovals(approvals.filter(item => item.id !== id));
  };

  const handleQuickAction = (actionName) => {
    alert(`Opening ${actionName}... (This will be connected to the database later)`);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h2><span className="text-gradient">Quick Space</span> Admin Dashboard</h2>
        <Link to="/" className="btn-secondary">Logout</Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>Platform Overview</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Total Users</span>
            <strong>1,245</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Total Sellers</span>
            <strong>84</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Active Spaces</span>
            <strong>112</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Monthly Revenue</span>
            <strong style={{ color: '#27c93f' }}>$89,450</strong>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>Pending Approvals</h3>
          {approvals.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>All caught up! No pending approvals.</p>
          ) : (
            <ul style={{ listStyle: 'none' }}>
              {approvals.map(item => (
                <li key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <strong>{item.type}</strong> - {item.name}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button onClick={() => handleAction(item.id, 'Approval')} className="btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Approve</button>
                    <button onClick={() => handleAction(item.id, 'Rejection')} className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>Quick Actions</h3>
          <button onClick={() => handleQuickAction('Manage Users')} className="btn-secondary" style={{ width: '100%', marginBottom: '1rem' }}>Manage Users</button>
          <button onClick={() => handleQuickAction('Platform Settings')} className="btn-secondary" style={{ width: '100%', marginBottom: '1rem' }}>Platform Settings</button>
          <button onClick={() => handleQuickAction('Support Tickets')} className="btn-secondary" style={{ width: '100%' }}>View Support Tickets (4)</button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
