import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/Registration.css'; // Reuse form styles
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    role: 'user',
    phone: ''
  });
  
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved
        }
      });
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.phone) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      
      // Strip non-digits and enforce +91 format
      let cleanPhone = formData.phone.replace(/\D/g, '');
      if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
          cleanPhone = cleanPhone.substring(2);
      }
      const formattedPhone = '+91' + cleanPhone;
      
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      setError(`Failed to send OTP: ${err.message || 'Check console for details.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();
      
      // 2. Register user in backend
      let cleanPhone = formData.phone.replace(/\s+/g, '');
      const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : '+91' + cleanPhone;
      const payload = { ...formData, phone: formattedPhone, idToken };

      const response = await fetch('http://3.110.191.121:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();

      if (data.success) {
        if (payload.role === 'user') navigate('/user');
        else if (payload.role === 'seller') navigate('/seller');
        else if (payload.role === 'admin') navigate('/admin');
      } else {
        setError(data.error || 'Failed to register.');
      }
    } catch (err) {
      if (err.message && err.message.includes('auth/')) {
        setError('Invalid OTP. Please try again.');
      } else {
        setError('Could not connect to backend server.');
      }
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

        <div id="recaptcha-container"></div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="registration-form">
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
              <label className="form-label">Phone Number (Required)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div className="form-input" style={{ flex: '0 0 60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)' }}>+91</div>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-input" style={{ flex: 1 }} placeholder="9876543210" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">I want to...</label>
              <select name="role" className="form-input" value={formData.role} onChange={handleChange}>
                <option value="user">Rent a space (User)</option>
                <option value="seller">List my spaces (Seller)</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Sending OTP...' : 'Verify Phone & Register'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtpAndRegister} className="registration-form">
            <p style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--color-primary-light)' }}>
              We sent a code to {formData.phone}
            </p>
            <div className="form-group">
              <label className="form-label">Enter 6-digit OTP</label>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)} className="form-input" placeholder="123456" required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating Account...' : 'Confirm OTP & Complete'}
            </button>
            <button type="button" onClick={() => setOtpSent(false)} className="btn-secondary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
              Change Number
            </button>
          </form>
        )}
        
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Log in here</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
