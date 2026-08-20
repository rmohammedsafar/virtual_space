import React, { useState } from 'react';
import './Registration.css';

const Registration = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    plan: 'Starter'
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <section className="registration" id="registration">
      <div className="container">
        <div className="registration-wrapper glass-panel">
          <div className="registration-content">
            <h2 className="registration-title">Get Your <span className="text-gradient">Quick Space</span></h2>
            <p className="registration-desc">
              Join thousands of modern businesses operating globally with a premium virtual space. 
              Fill out the form below to begin your journey.
            </p>
            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">🚀</div>
                <div>
                  <h4>Instant Setup</h4>
                  <p>Get your business address ready in under 5 minutes.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🔒</div>
                <div>
                  <h4>Secure & Private</h4>
                  <p>Your mail and data are handled with bank-level security.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="registration-form-container">
            {submitted ? (
              <div className="success-message text-center">
                <div className="success-icon">✨</div>
                <h3>Welcome to Quick Space!</h3>
                <p>We've received your registration for {formData.companyName}. Check your email to complete the payment and setup.</p>
                <button className="btn-primary" onClick={() => setSubmitted(false)}>Register Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input 
                    type="text" 
                    name="companyName"
                    className="form-input" 
                    placeholder="e.g. Acme Innovations LLC" 
                    required 
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Work Email</label>
                  <input 
                    type="email" 
                    name="email"
                    className="form-input" 
                    placeholder="you@company.com" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    className="form-input" 
                    placeholder="+1 (555) 000-0000" 
                    required 
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Select Plan</label>
                  <select 
                    name="plan"
                    className="form-input" 
                    value={formData.plan}
                    onChange={handleChange}
                  >
                    <option value="Starter">Starter - $29/mo</option>
                    <option value="Professional">Professional - $79/mo</option>
                    <option value="Enterprise">Enterprise - $199/mo</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary submit-btn">
                  Continue to Payment
                </button>
                <p className="form-terms">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;
