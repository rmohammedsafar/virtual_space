import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Registration.css'; // Reuse form styles

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('user');

  const handleLogin = (e) => {
    e.preventDefault();
    // Route based on role
    if (role === 'user') navigate('/user');
    else if (role === 'seller') navigate('/seller');
    else if (role === 'admin') navigate('/admin');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '400px', width: '100%' }}>
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <span className="logo-icon" style={{ display: 'inline-flex', width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%)', color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900, marginBottom: '1rem' }}>Q</span>
          <h2>Welcome Back</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Login to access your space</p>
        </div>
        
        <form onSubmit={handleLogin} className="registration-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" placeholder="you@company.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="••••••••" required />
          </div>
          <div className="form-group">
            <label className="form-label">Select Role (Mockup)</label>
            <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User (Renter)</option>
              <option value="seller">Seller (Provider)</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
