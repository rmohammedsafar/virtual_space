import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../components/Features.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    rentals: [],
    activeRentalsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);

  useEffect(() => {
    // Auth Guard
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== 'user') {
      navigate('/login');
      return;
    }
    
    setUser(parsedUser);

    // Fetch stats for logged-in user
    fetch(`http://localhost:5000/api/stats/user/${parsedUser.id}`)
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

  if (!user) return null; // Prevent flash of content before redirect

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h2><span className="text-gradient">Quick Space</span> Dashboard <span style={{fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 'normal'}}>({user.email})</span></h2>
        <button onClick={handleLogout} className="btn-secondary">Logout</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary-light)' }}>My Active Space (Live)</h3>
          {loading ? (
            <p>Loading your spaces...</p>
          ) : stats.rentals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>You haven't rented any spaces yet.</p>
              <button onClick={() => navigate('/rent')} className="btn-primary" style={{ width: '100%' }}>Explore Spaces to Rent</button>
            </div>
          ) : (
            stats.rentals.map(rental => (
              <div key={rental.id} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
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
              <li style={{ padding: '10px 0', color: '#ffbd2e', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem' }}>Rent a space to access the mailroom.</p>
                <button onClick={() => navigate('/rent')} className="btn-primary" style={{ width: '100%', backgroundColor: '#ffbd2e', color: 'var(--color-text)', border: 'none' }}>Get a Virtual Address</button>
              </li>
            ) : (
              <>
                <li style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <strong>IRS Notice</strong> - Received Today 
                  <button onClick={() => setSelectedMail({ title: 'IRS Notice', date: 'Today', type: 'Tax Document' })} style={{ float: 'right', background: 'none', color: 'var(--color-primary)', border: 'none', cursor: 'pointer' }}>View Scan</button>
                </li>
                <li style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <strong>Bank Statement</strong> - Yesterday 
                  <button onClick={() => setSelectedMail({ title: 'Bank Statement', date: 'Yesterday', type: 'Financial' })} style={{ float: 'right', background: 'none', color: 'var(--color-primary)', border: 'none', cursor: 'pointer' }}>View Scan</button>
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
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => setIsPaymentModalOpen(true)}>Manage Payment Methods</button>
        </div>

      </div>

      {/* Payment Methods Modal */}
      {isPaymentModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '400px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setIsPaymentModalOpen(false)}
              style={{ position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', color: 'var(--color-text)', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              &times;
            </button>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary-light)' }}>Payment Methods</h3>
            
            <div style={{ background: 'var(--color-bg-card)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>•••• •••• •••• 4242</strong>
                  <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '4px' }}>Expires 12/28 • Visa</div>
                </div>
                <span className="badge" style={{ background: 'rgba(39, 201, 63, 0.2)', color: '#27c93f', border: '1px solid #27c93f' }}>Default</span>
              </div>
            </div>

            <div style={{ background: 'var(--color-bg-card)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>safar@okhdfcbank</strong>
                  <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '4px' }}>UPI ID</div>
                </div>
              </div>
            </div>

            <button className="btn-secondary" style={{ width: '100%', marginBottom: '10px' }}>+ Add New Card</button>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedMail && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'var(--color-modal-overlay)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', height: '80vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <button 
              onClick={() => setSelectedMail(null)}
              style={{ position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', color: 'var(--color-text)', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10 }}
            >
              &times;
            </button>
            
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <h3 style={{ margin: 0, color: 'var(--color-primary-light)' }}>{selectedMail.title}</h3>
              <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#aaa' }}>{selectedMail.type} • Received: {selectedMail.date}</p>
            </div>
            
            <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              <div style={{ 
                width: '100%', 
                maxWidth: '500px', 
                height: '100%', 
                backgroundColor: '#fff', 
                borderRadius: '4px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                padding: '3rem',
                color: '#333',
                overflowY: 'auto',
                position: 'relative'
              }}>
                <div style={{ borderBottom: '2px solid #ccc', paddingBottom: '1rem', marginBottom: '2rem' }}>
                  <h2 style={{ margin: 0, color: '#111' }}>OFFICIAL DOCUMENT</h2>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>CONFIDENTIAL</p>
                </div>
                <div style={{ height: '15px', backgroundColor: '#e0e0e0', width: '100%', marginBottom: '10px', borderRadius: '2px' }}></div>
                <div style={{ height: '15px', backgroundColor: '#e0e0e0', width: '90%', marginBottom: '10px', borderRadius: '2px' }}></div>
                <div style={{ height: '15px', backgroundColor: '#e0e0e0', width: '95%', marginBottom: '30px', borderRadius: '2px' }}></div>
                
                <div style={{ height: '15px', backgroundColor: '#e0e0e0', width: '100%', marginBottom: '10px', borderRadius: '2px' }}></div>
                <div style={{ height: '15px', backgroundColor: '#e0e0e0', width: '85%', marginBottom: '10px', borderRadius: '2px' }}></div>
                <div style={{ height: '15px', backgroundColor: '#e0e0e0', width: '92%', marginBottom: '10px', borderRadius: '2px' }}></div>
                <div style={{ height: '15px', backgroundColor: '#e0e0e0', width: '40%', marginBottom: '40px', borderRadius: '2px' }}></div>
                
                <div style={{ border: '2px dashed #ccc', padding: '2rem', textAlign: 'center', color: '#999', borderRadius: '8px' }}>
                  [ SCANNED IMAGE PLACEHOLDER ]<br/>
                  High-res scan available for download
                </div>
              </div>
            </div>

            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" style={{ borderColor: '#ff4757', color: '#ff4757' }} onClick={() => { toast.success('Document marked for physical shredding.'); setSelectedMail(null); }}>Request Shredding</button>
              <button className="btn-secondary" onClick={() => { toast.success('Forwarding request sent.'); setSelectedMail(null); }}>Forward Mail</button>
              <button className="btn-primary" onClick={() => { toast.success('Downloading high-res PDF...'); }}>Download PDF</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserDashboard;
