import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon">Q</span>
              <span className="logo-text">Quick <span className="text-gradient">Space</span></span>
            </div>
            <p className="footer-desc">
              Empowering modern businesses with premium virtual spaces, dedicated addresses, and global presence.
            </p>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-title">Platform</h4>
            <ul>
              <li><a href="#">Virtual Address</a></li>
              <li><a href="#">Mail Forwarding</a></li>
              <li><a href="#">Meeting Rooms</a></li>
              <li><a href="#">Pricing</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-title">Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact Support</a></li>
              <li><a href="#">Partners</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-title">Legal</h4>
            <ul>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">Data Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Quick Space. All rights reserved.</p>
          <div className="social-links">
            <a href="#" className="social-icon">Tw</a>
            <a href="#" className="social-icon">Li</a>
            <a href="#" className="social-icon">In</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
