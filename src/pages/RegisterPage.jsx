import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/Registration.css'; // Reuse form styles

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (data.success) {
        // Automatically route to their dashboard
        if (formData.role === 'user') navigate('/user');
        else if (formData.role === 'seller') navigate('/seller');
        else if (formData.role === 'admin') navigate('/admin');
      } else {
        setError(data.error || 'Failed to register.');
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
          <h2>Create Account</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Get started with your virtual space</p>
        </div>
        
        {error && <div style={{ background: 'rgba(255, 95, 86, 0.2)', border: '1px solid #ff5f56', padding: '10px', borderRadius: '8px', color: '#ff5f56', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleRegister} className="registration-form">
          <div className="form-group">
            <label className="form-label">Company / Display Name</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="form-input" placeholder="e.g. Acme Innovations LLC" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="you@company.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-input" placeholder="Create a secure password" required minLength="6" />
          </div>
          <div className="form-group">
            <label className="form-label">I want to...</label>
            <select name="role" className="form-input" value={formData.role} onChange={handleChange}>
              <option value="user">Rent a space (User)</option>
              <option value="seller">List my spaces (Seller)</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Log in here</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
