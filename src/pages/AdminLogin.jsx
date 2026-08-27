import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/Registration.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://3.110.191.121:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();

      if (data.success) {
        if (data.user.role === 'admin') {
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/admin');
        } else {
          setError('Access Denied. You are not an administrator.');
        }
      } else {
        setError(data.error || 'Invalid admin credentials.');
      }
    } catch (err) {
      setError('Could not connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--color-bg-dark)' }}>
      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '400px', width: '100%', border: '1px solid var(--color-border)' }}>
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <span className="logo-icon" style={{ display: 'inline-flex', width: '50px', height: '50px', borderRadius: '50%', background: '#ff4757', color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900, marginBottom: '1rem' }}>A</span>
          </Link>
          <h2 style={{ color: 'var(--color-text)' }}>System Admin Portal</h2>
          <p style={{ color: '#ff4757', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '5px' }}>RESTRICTED ACCESS</p>
        </div>
        
        {error && <div style={{ background: 'rgba(255, 95, 86, 0.2)', border: '1px solid #ff5f56', padding: '10px', borderRadius: '8px', color: '#ff5f56', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleLogin} className="registration-form">
          <div className="form-group">
            <label className="form-label" style={{ color: 'var(--color-text-muted)' }}>Admin Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="admin@quickspace.com" required style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }} />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ color: 'var(--color-text-muted)' }}>Master Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" placeholder="••••••••" required style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }} />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem', opacity: loading ? 0.7 : 1, background: '#ff4757', border: 'none', color: 'var(--color-text)' }}>
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
          Only authorized personnel may access this portal.
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
