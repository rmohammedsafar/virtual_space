import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    spaces: [],
    earnings: 0,
    activeSpacesCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [newSpace, setNewSpace] = useState({ name: '', address: '', monthlyPrice: 0 });

  useEffect(() => {
    // Auth Guard
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== 'seller') {
      navigate('/login');
      return;
    }
    
    setUser(parsedUser);

    fetch(`http://3.110.191.121:5000/api/stats/seller/${parsedUser.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        }
      })
      .catch(err => console.error("Error fetching stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCreateSpace = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://3.110.191.121:5000/api/spaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newSpace, sellerId: user.id })
      });
      const data = await res.json();
      if (data.success) {
        setStats({...stats, spaces: [...stats.spaces, data.space]});
        toast.success('Space Listed successfully!');
        setActiveModal(null);
        setNewSpace({ name: '', address: '', monthlyPrice: 0 });
      } else {
        toast.error(data.error || 'Failed to list space');
      }
    } catch (err) {
      toast.error('Error creating space');
    }
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h2><span className="text-gradient">Quick Space</span> Seller Dashboard <span style={{fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 'normal'}}>({user.email})</span></h2>
        <button onClick={handleLogout} className="btn-secondary">Logout</button>
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
                <li key={space.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <strong>{space.name}</strong> - ₹{space.monthlyPrice}/mo
                </li>
              ))}
            </ul>
          )}
          <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setActiveModal('List New Space')}>+ List New Space</button>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>Earnings (This Month)</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1rem' }}>
                ₹{stats.earnings.toLocaleString()}
              </div>
              <p style={{ color: '#27c93f' }}>Based on {stats.activeSpacesCount} active spaces</p>
            </>
          )}
          <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setActiveModal('Withdraw Funds')}>Withdraw Funds</button>
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
                <li style={{ padding: '10px 0', color: '#ffbd2e', display: 'flex', justifyContent: 'space-between' }}>
                  Upload mail scans for 3 users.
                  <button onClick={() => setActiveModal('Upload Mail')} style={{ background: 'none', border: 'none', color: 'var(--color-text)', textDecoration: 'underline', cursor: 'pointer' }}>Action</button>
                </li>
                <li style={{ padding: '10px 0', color: '#ff5f56', display: 'flex', justifyContent: 'space-between' }}>
                  Confirm meeting room booking for Acme Innovations.
                  <button onClick={() => setActiveModal('Confirm Booking')} style={{ background: 'none', border: 'none', color: 'var(--color-text)', textDecoration: 'underline', cursor: 'pointer' }}>Action</button>
                </li>
              </>
            )}
          </ul>
        </div>

      </div>

      {/* Action Modals */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'var(--color-modal-overlay)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setActiveModal(null)}
              style={{ position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', color: 'var(--color-text)', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              &times;
            </button>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary-light)' }}>{activeModal}</h3>

            {activeModal === 'List New Space' && (
              <form onSubmit={handleCreateSpace}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Space Name</label>
                  <input type="text" required className="form-input" value={newSpace.name} onChange={e => setNewSpace({...newSpace, name: e.target.value})} placeholder="e.g. Downtown Premium Hub" />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Address</label>
                  <input type="text" required className="form-input" value={newSpace.address} onChange={e => setNewSpace({...newSpace, address: e.target.value})} placeholder="Full physical address" />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Monthly Price (₹)</label>
                  <input type="number" required className="form-input" value={newSpace.monthlyPrice} onChange={e => setNewSpace({...newSpace, monthlyPrice: e.target.value})} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Create Listing</button>
              </form>
            )}

            {activeModal === 'Withdraw Funds' && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Available Balance</p>
                <h1 style={{ color: 'var(--color-text)', marginBottom: '1.5rem' }}>₹{stats.earnings.toLocaleString()}</h1>
                <input type="number" className="form-input" placeholder="Amount to withdraw" style={{ marginBottom: '1rem' }} />
                <button className="btn-primary" style={{ width: '100%' }} onClick={() => { toast.success('Withdrawal request submitted!'); setActiveModal(null); }}>Request Payout to Bank</button>
              </div>
            )}

            {(activeModal === 'Upload Mail' || activeModal === 'Confirm Booking') && (
              <div>
                <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Simulated action area for {activeModal}.</p>
                <button className="btn-primary" style={{ width: '100%' }} onClick={() => { toast.success('Task completed!'); setActiveModal(null); }}>Complete Task</button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
