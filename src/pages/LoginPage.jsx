import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/Registration.css'; // Reuse form styles

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  
  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Phone state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

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
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'user') navigate('/user');
        else if (data.user.role === 'seller') navigate('/seller');
        else if (data.user.role === 'admin') navigate('/admin');
      } else {
        setError(data.error || 'Failed to login. Is the database connected?');
      }
    } catch (err) {
      setError('Could not connect to backend server. Make sure it is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
          cleanPhone = cleanPhone.substring(2);
      }
      const formattedPhone = '+91' + cleanPhone;

      const response = await fetch('http://3.110.191.121:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone })
      });
      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
          cleanPhone = cleanPhone.substring(2);
      }
      const formattedPhone = '+91' + cleanPhone;

      const response = await fetch('http://3.110.191.121:5000/api/auth/phone-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: formattedPhone, otp })
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'user') navigate('/user');
        else if (data.user.role === 'seller') navigate('/seller');
        else if (data.user.role === 'admin') navigate('/admin');
      } else {
        setError(data.error || 'Invalid OTP.');
      }
    } catch (err) {
      setError('Could not connect to server.');
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
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            type="button" 
            onClick={() => setLoginMethod('email')} 
            className={loginMethod === 'email' ? 'btn-primary' : 'btn-secondary'} 
            style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
          >
            Email
          </button>
          <button 
            type="button" 
            onClick={() => setLoginMethod('phone')} 
            className={loginMethod === 'phone' ? 'btn-primary' : 'btn-secondary'} 
            style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}
          >
            Phone Number
          </button>
        </div>

        {error && <div style={{ background: 'rgba(255, 95, 86, 0.2)', border: '1px solid #ff5f56', padding: '10px', borderRadius: '8px', color: '#ff5f56', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        {/* Email Login Form */}
        {loginMethod === 'email' && (
          <form onSubmit={handleLogin} className="registration-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="you@company.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" placeholder="••••••••" required />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Connecting...' : 'Login'}
            </button>
          </form>
        )}

        {/* Phone Login Form */}
        {loginMethod === 'phone' && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="registration-form">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div className="form-input" style={{ flex: '0 0 60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)' }}>+91</div>
                    <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="form-input" style={{ flex: 1 }} placeholder="9876543210" required />
                  </div>
                </div>
                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="registration-form">
                <div className="form-group">
                  <label className="form-label">Enter 6-digit OTP</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value)} className="form-input" placeholder="123456" required />
                </div>
                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Verifying...' : 'Verify OTP & Login'}
                </button>
              </form>
            )}
          </div>
        )}
        
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
