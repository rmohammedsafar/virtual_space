import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    activeSpaces: 0,
    revenue: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [userList, setUserList] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  const [approvals, setApprovals] = useState([
    { id: 1, type: 'New Space Listing', name: 'Miami Beach Front' },
    { id: 2, type: 'Seller Application', name: 'Global Spaces Inc.' }
  ]);

  useEffect(() => {
    // Strict Admin Auth Guard
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/admin/login');
      return;
    }
    
    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    
    setUser(parsedUser);

    // Fetch live stats from SQLite backend
    fetch('http://3.110.191.121:5000/api/stats/admin')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        }
      })
      .catch(err => console.error("Error fetching stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = (id, action) => {
    alert(`${action} successful!`);
    setApprovals(approvals.filter(item => item.id !== id));
  };

  const handleQuickAction = async (actionName) => {
    setActiveModal(actionName);
    if (actionName === 'Manage Users') {
      setModalLoading(true);
      try {
        const res = await fetch('http://3.110.191.121:5000/api/admin/users');
        const data = await res.json();
        if (data.success) {
          setUserList(data.users);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setModalLoading(false);
      }
    }
  };

  const handleSuspendUser = async (userId, email) => {
    if (!window.confirm(`Are you sure you want to suspend ${email}?`)) return;
    
    try {
      const res = await fetch(`http://3.110.191.121:5000/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        // Remove from UI
        setUserList(userList.filter(u => u.id !== userId));
      } else {
        alert(data.error || 'Failed to suspend user');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h2><span className="text-gradient">Quick Space</span> Admin Dashboard <span style={{fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 'normal'}}>({user.email})</span></h2>
        <button onClick={handleLogout} className="btn-secondary">Logout</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>Platform Overview (Live)</h3>
          {loading ? (
            <p>Loading database stats...</p>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Total Users</span>
                <strong>{stats.totalUsers}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Total Sellers</span>
                <strong>{stats.totalSellers}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Active Spaces</span>
                <strong>{stats.activeSpaces}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Monthly Revenue</span>
                <strong style={{ color: '#27c93f' }}>₹{stats.revenue.toLocaleString()}</strong>
              </div>
            </>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>Pending Approvals</h3>
          {approvals.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>All caught up! No pending approvals.</p>
          ) : (
            <ul style={{ listStyle: 'none' }}>
              {approvals.map(item => (
                <li key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
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

      {/* Quick Action Modals */}
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setActiveModal(null)}
              style={{ position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', color: 'var(--color-text)', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              &times;
            </button>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary-light)' }}>{activeModal}</h3>

            {activeModal === 'Manage Users' && (
              <div>
                {modalLoading ? <p>Loading users...</p> : (
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Email</th>
                        <th style={{ padding: '10px' }}>Role</th>
                        <th style={{ padding: '10px' }}>Joined</th>
                        <th style={{ padding: '10px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList.map((u, index) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '10px' }}>{index + 1}</td>
                          <td style={{ padding: '10px' }}>{u.email}</td>
                          <td style={{ padding: '10px' }}>
                            <span className="badge" style={{ background: u.role === 'admin' ? 'rgba(255, 71, 87, 0.2)' : u.role === 'seller' ? 'rgba(39, 201, 63, 0.2)' : 'rgba(255, 255, 255, 0.1)' }}>
                              {u.role}
                            </span>
                          </td>
                          <td style={{ padding: '10px' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td style={{ padding: '10px' }}>
                            <button className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => handleSuspendUser(u.id, u.email)}>Suspend</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeModal === 'Platform Settings' && (
              <div>
                <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Global configuration for the Quick Space platform.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--color-bg-card)', borderRadius: '8px', marginBottom: '10px' }}>
                  <span>Allow New Seller Registrations</span>
                  <input type="checkbox" defaultChecked />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--color-bg-card)', borderRadius: '8px', marginBottom: '10px' }}>
                  <span>Maintenance Mode</span>
                  <input type="checkbox" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--color-bg-card)', borderRadius: '8px', marginBottom: '10px' }}>
                  <span>Platform Fee (%)</span>
                  <input type="number" defaultValue={5} style={{ width: '60px', background: 'var(--color-bg-card)', color: 'var(--color-text)', border: '1px solid #333', borderRadius: '4px', padding: '5px' }} />
                </div>
                <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => { alert('Settings Saved!'); setActiveModal(null); }}>Save Settings</button>
              </div>
            )}

            {activeModal === 'Support Tickets' && (
              <div>
                <ul style={{ listStyle: 'none' }}>
                  <li style={{ padding: '15px', background: 'var(--color-bg-card)', borderRadius: '8px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <strong>Cannot upload space images</strong>
                      <span className="badge" style={{ background: 'rgba(255, 189, 46, 0.2)', color: '#ffbd2e' }}>High</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>From: seller1@test.com</p>
                    <button className="btn-secondary" style={{ marginTop: '10px', fontSize: '0.8rem', padding: '5px 10px' }}>Reply</button>
                  </li>
                  <li style={{ padding: '15px', background: 'var(--color-bg-card)', borderRadius: '8px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <strong>Billing question about Pro plan</strong>
                      <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>Normal</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>From: john@user.com</p>
                    <button className="btn-secondary" style={{ marginTop: '10px', fontSize: '0.8rem', padding: '5px 10px' }}>Reply</button>
                  </li>
                </ul>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
