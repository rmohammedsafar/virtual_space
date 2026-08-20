import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../components/Features.css';

const UserDashboard = () => {
  const [stats, setStats] = useState({
    rentals: [],
    activeRentalsCount: 0
  });
  const [loading, setLoading] = useState(true);

  // In a real app, you would pass the logged-in user's ID here. 
  // For the demo, we assume user ID 2.
  const userId = 2;

  useEffect(() => {
    fetch(`http://localhost:5000/api/stats/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        }
      })
      .catch(err => console.error("Error fetching stats:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h2><span className="text-gradient">Quick Space</span> User Dashboard</h2>
        <Link to="/" className="btn-secondary">Logout</Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>My Active Space (Live)</h3>
          {loading ? (
            <p>Loading your spaces...</p>
          ) : stats.rentals.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>You haven't rented any spaces yet.</p>
          ) : (
            stats.rentals.map(rental => (
              <div key={rental.id} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                  <strong>{rental.Space?.name || 'Unknown Space'}</strong><br/>
                  {rental.Space?.address || 'Address pending'}
                </div>
                <span className="badge" style={{ background: 'rgba(39, 201, 63, 0.2)', color: '#27c93f', border: '1px solid #27c93f' }}>
                  Status: {rental.status} - {rental.planType}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>Digital Mailroom</h3>
          <ul style={{ listStyle: 'none' }}>
            {stats.rentals.length === 0 ? (
              <li style={{ padding: '10px 0', color: '#ffbd2e' }}>Rent a space to access the mailroom.</li>
            ) : (
              <>
                <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <strong>IRS Notice</strong> - Received Today <button style={{ float: 'right', background: 'none', color: 'var(--color-primary)', border: 'none', cursor: 'pointer' }}>View Scan</button>
                </li>
                <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <strong>Bank Statement</strong> - Yesterday <button style={{ float: 'right', background: 'none', color: 'var(--color-primary)', border: 'none', cursor: 'pointer' }}>View Scan</button>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>Billing Overview</h3>
          {stats.rentals.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No active billing subscriptions.</p>
          ) : (
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Your next payment is due soon.</p>
          )}
          <button className="btn-primary" style={{ width: '100%' }}>Manage Payment Methods</button>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
