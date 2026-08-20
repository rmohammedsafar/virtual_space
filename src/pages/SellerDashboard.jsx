import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SellerDashboard = () => {
  const [stats, setStats] = useState({
    spaces: [],
    earnings: 0,
    activeSpacesCount: 0
  });
  const [loading, setLoading] = useState(true);

  // In a real app, you would pass the logged-in user's ID here. 
  // For the demo, we assume seller ID 1.
  const sellerId = 1;

  useEffect(() => {
    fetch(`http://localhost:5000/api/stats/seller/${sellerId}`)
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
        <h2><span className="text-gradient">Quick Space</span> Seller Dashboard</h2>
        <Link to="/" className="btn-secondary">Logout</Link>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>My Properties (Live)</h3>
          {loading ? (
            <p>Loading your spaces...</p>
          ) : stats.spaces.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>You haven't listed any spaces yet.</p>
          ) : (
            <ul style={{ listStyle: 'none' }}>
              {stats.spaces.map(space => (
                <li key={space.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <strong>{space.name}</strong> - ${space.monthlyPrice}/mo
                </li>
              ))}
            </ul>
          )}
          <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>+ List New Space</button>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>Earnings (This Month)</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
                ${stats.earnings.toLocaleString()}
              </div>
              <p style={{ color: '#27c93f' }}>Based on {stats.activeSpacesCount} active spaces</p>
            </>
          )}
          <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Withdraw Funds</button>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>Action Required</h3>
          <ul style={{ listStyle: 'none' }}>
            {stats.spaces.length === 0 ? (
              <li style={{ padding: '10px 0', color: '#ffbd2e' }}>
                List your first space to start earning!
              </li>
            ) : (
              <>
                <li style={{ padding: '10px 0', color: '#ffbd2e' }}>
                  Upload mail scans for 3 users.
                </li>
                <li style={{ padding: '10px 0', color: '#ff5f56' }}>
                  Confirm meeting room booking for Acme Innovations.
                </li>
              </>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default SellerDashboard;
