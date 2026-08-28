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
  const [spaceList, setSpaceList] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [editSpaceData, setEditSpaceData] = useState(null);
  const [editUserData, setEditUserData] = useState(null);
  const [siteContent, setSiteContent] = useState({});
  const [feedbackList, setFeedbackList] = useState([]);

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
    } else if (actionName === 'Manage Spaces') {
      setModalLoading(true);
      try {
        const res = await fetch('http://3.110.191.121:5000/api/spaces');
        const data = await res.json();
        if (data.success) {
          setSpaceList(data.spaces);
        }
      } catch (err) {
        console.error("Failed to fetch spaces", err);
      } finally {
        setModalLoading(false);
      }
    } else if (actionName === 'Manage Site Content') {
      setModalLoading(true);
      try {
        const res = await fetch('http://3.110.191.121:5000/api/content');
        const data = await res.json();
        if (data.success) {
          setSiteContent(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch site content", err);
      } finally {
        setModalLoading(false);
      }
    } else if (actionName === 'User Feedback') {
      setModalLoading(true);
      try {
        const res = await fetch('http://3.110.191.121:5000/api/feedback');
        const data = await res.json();
        if (data.success) {
          setFeedbackList(data.feedbacks);
        }
      } catch (err) {
        console.error("Failed to fetch feedback", err);
      } finally {
        setModalLoading(false);
      }
    }
  };

  const handleUpdateContent = async (key) => {
    try {
      const res = await fetch(`http://3.110.191.121:5000/api/admin/content/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: siteContent[key] })
      });
      const data = await res.json();
      if (data.success) {
        alert(`${key} updated successfully! Reload the site to see changes.`);
      } else {
        alert(data.error || 'Failed to update content');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const handleUpdateSpace = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://3.110.191.121:5000/api/admin/spaces/${editSpaceData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editSpaceData)
      });
      const data = await res.json();
      if (data.success) {
        setSpaceList(spaceList.map(s => s.id === editSpaceData.id ? data.space : s));
        setEditSpaceData(null);
        alert('Space updated successfully!');
      } else {
        alert(data.error || 'Failed to update space');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const handleDeleteSpace = async (id) => {
    if (!window.confirm('Are you sure you want to delete this space?')) return;
    try {
      const res = await fetch(`http://3.110.191.121:5000/api/admin/spaces/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSpaceList(spaceList.filter(s => s.id !== id));
        alert('Space deleted successfully!');
      } else {
        alert(data.error || 'Failed to delete space');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://3.110.191.121:5000/api/admin/users/${editUserData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUserData)
      });
      const data = await res.json();
      if (data.success) {
        setUserList(userList.map(u => u.id === editUserData.id ? data.user : u));
        setEditUserData(null);
        alert('User updated successfully!');
      } else {
        alert(data.error || 'Failed to update user');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
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
        <h2><Link to="/" style={{ textDecoration: 'none' }}><span className="text-gradient">Quick Space</span></Link> Admin Dashboard <span style={{fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 'normal'}}>({user.email})</span></h2>
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
          <button onClick={() => handleQuickAction('Manage Spaces')} className="btn-secondary" style={{ width: '100%', marginBottom: '1rem' }}>Manage Spaces</button>
          <button onClick={() => handleQuickAction('Manage Site Content')} className="btn-secondary" style={{ width: '100%', marginBottom: '1rem' }}>Manage Site Content</button>
          <button onClick={() => handleQuickAction('User Feedback')} className="btn-secondary" style={{ width: '100%', marginBottom: '1rem' }}>User Feedback</button>
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
                {modalLoading ? <p>Loading users...</p> : editUserData ? (
                  <form onSubmit={handleUpdateUser} style={{ background: 'var(--color-bg-card)', padding: '1rem', borderRadius: '8px' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Edit User (ID: {editUserData.id})</h4>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                      <input type="email" required className="form-input" value={editUserData.email} onChange={e => setEditUserData({...editUserData, email: e.target.value})} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Role</label>
                      <select className="form-input" value={editUserData.role} onChange={e => setEditUserData({...editUserData, role: e.target.value})}>
                        <option value="user">User</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
                      <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setEditUserData(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Email</th>
                        <th style={{ padding: '10px' }}>Role</th>
                        <th style={{ padding: '10px' }}>Joined</th>
                        <th style={{ padding: '10px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList.map((u, index) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '10px' }}>{u.id}</td>
                          <td style={{ padding: '10px' }}>{u.email}</td>
                          <td style={{ padding: '10px' }}>
                            <span className="badge" style={{ background: u.role === 'admin' ? 'rgba(255, 71, 87, 0.2)' : u.role === 'seller' ? 'rgba(39, 201, 63, 0.2)' : 'rgba(255, 255, 255, 0.1)' }}>
                              {u.role}
                            </span>
                          </td>
                          <td style={{ padding: '10px' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td style={{ padding: '10px', display: 'flex', gap: '5px' }}>
                            <button className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => setEditUserData(u)}>Edit</button>
                            <button className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem', color: '#ff4757', borderColor: '#ff4757' }} onClick={() => handleSuspendUser(u.id, u.email)}>Suspend</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeModal === 'Manage Spaces' && (
              <div>
                {modalLoading ? <p>Loading spaces...</p> : editSpaceData ? (
                  <form onSubmit={handleUpdateSpace} style={{ background: 'var(--color-bg-card)', padding: '1rem', borderRadius: '8px' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Edit Space (ID: {editSpaceData.id})</h4>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Name</label>
                      <input type="text" required className="form-input" value={editSpaceData.name} onChange={e => setEditSpaceData({...editSpaceData, name: e.target.value})} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Address</label>
                      <input type="text" required className="form-input" value={editSpaceData.address} onChange={e => setEditSpaceData({...editSpaceData, address: e.target.value})} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '5px' }}>Monthly Price (₹)</label>
                      <input type="number" required className="form-input" value={editSpaceData.monthlyPrice} onChange={e => setEditSpaceData({...editSpaceData, monthlyPrice: e.target.value})} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Changes</button>
                      <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setEditSpaceData(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Name</th>
                        <th style={{ padding: '10px' }}>Price</th>
                        <th style={{ padding: '10px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {spaceList.map((space) => (
                        <tr key={space.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '10px' }}>{space.id}</td>
                          <td style={{ padding: '10px' }}>{space.name}</td>
                          <td style={{ padding: '10px' }}>₹{space.monthlyPrice}</td>
                          <td style={{ padding: '10px', display: 'flex', gap: '5px' }}>
                            <button className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => setEditSpaceData(space)}>Edit</button>
                            <button className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem', color: '#ff4757', borderColor: '#ff4757' }} onClick={() => handleDeleteSpace(space.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeModal === 'Manage Site Content' && (
              <div>
                <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Edit the static text shown on the website (CMS).</p>
                {modalLoading ? <p>Loading content...</p> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ background: 'var(--color-bg-card)', padding: '1rem', borderRadius: '8px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hero Title (Landing Page)</label>
                      <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '10px' }}>Use \n for line breaks</p>
                      <textarea className="form-input" rows="2" value={siteContent.hero_title || ''} onChange={e => setSiteContent({...siteContent, hero_title: e.target.value})} style={{ marginBottom: '10px' }}></textarea>
                      <button className="btn-primary" style={{ padding: '5px 15px', fontSize: '0.9rem' }} onClick={() => handleUpdateContent('hero_title')}>Save Title</button>
                    </div>
                    
                    <div style={{ background: 'var(--color-bg-card)', padding: '1rem', borderRadius: '8px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hero Subtitle</label>
                      <textarea className="form-input" rows="3" value={siteContent.hero_subtitle || ''} onChange={e => setSiteContent({...siteContent, hero_subtitle: e.target.value})} style={{ marginBottom: '10px' }}></textarea>
                      <button className="btn-primary" style={{ padding: '5px 15px', fontSize: '0.9rem' }} onClick={() => handleUpdateContent('hero_subtitle')}>Save Subtitle</button>
                    </div>

                    <div style={{ background: 'var(--color-bg-card)', padding: '1rem', borderRadius: '8px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hero Button Text</label>
                      <input type="text" className="form-input" value={siteContent.hero_cta || ''} onChange={e => setSiteContent({...siteContent, hero_cta: e.target.value})} style={{ marginBottom: '10px' }} />
                      <button className="btn-primary" style={{ padding: '5px 15px', fontSize: '0.9rem' }} onClick={() => handleUpdateContent('hero_cta')}>Save Button Text</button>
                    </div>
                  </div>
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

            {activeModal === 'User Feedback' && (
              <div>
                <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>View and manage feedback submitted by users.</p>
                {modalLoading ? <p>Loading feedback...</p> : feedbackList.length === 0 ? (
                  <p>No feedback received yet.</p>
                ) : (
                  <ul style={{ listStyle: 'none' }}>
                    {feedbackList.map(feedback => (
                      <li key={feedback.id} style={{ padding: '15px', background: 'var(--color-bg-card)', borderRadius: '8px', marginBottom: '10px', borderLeft: feedback.status === 'unread' ? '4px solid var(--color-primary)' : '4px solid transparent' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <strong style={{ fontSize: '1.1rem' }}>{feedback.subject}</strong>
                          <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{new Date(feedback.createdAt).toLocaleString()}</span>
                        </div>
                        <p style={{ margin: '0 0 10px 0', fontSize: '0.95rem' }}>{feedback.message}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                          <span style={{ fontSize: '0.85rem', color: '#aaa' }}>From: {feedback.name} ({feedback.email})</span>
                          {feedback.status === 'unread' && (
                            <button 
                              className="btn-secondary" 
                              style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                              onClick={async () => {
                                try {
                                  const res = await fetch(`http://3.110.191.121:5000/api/feedback/${feedback.id}/read`, { method: 'PUT' });
                                  const data = await res.json();
                                  if (data.success) {
                                    setFeedbackList(feedbackList.map(f => f.id === feedback.id ? { ...f, status: 'read' } : f));
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
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
