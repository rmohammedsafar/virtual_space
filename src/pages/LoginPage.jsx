import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/Registration.css'; // Reuse form styles

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call our new Express Backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      
      const data = await response.json();

      if (data.success) {
        // Save user session to localStorage
        localStorage.setItem('user', JSON.stringify(data.user));

        // Route based on role
        if (role === 'user') navigate('/user');
        else if (role === 'seller') navigate('/seller');
        else if (role === 'admin') navigate('/admin');
      } else {
        setError(data.error || 'Failed to login. Is the database connected?');
      }
    } catch (err) {
      setError('Could not connect to backend server. Make sure it is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '400px', width: '100%' }}>
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <span className="logo-icon" style={{ display: 'inline-flex', width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%)', color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900, marginBottom: '1rem' }}>Q</span>
          </Link>
          <h2>Welcome Back</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Login to access your space</p>
        </div>
        
        {error && <div style={{ background: 'rgba(255, 95, 86, 0.2)', border: '1px solid #ff5f56', padding: '10px', borderRadius: '8px', color: '#ff5f56', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleLogin} className="registration-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="you@company.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" placeholder="••••••••" required />
          </div>
          <div className="form-group">
            <label className="form-label">Select Role</label>
            <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User (Renter)</option>
              <option value="seller">Seller (Provider)</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Connecting to Database...' : 'Login'}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
