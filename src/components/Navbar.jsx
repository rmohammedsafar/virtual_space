import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import StarBorder from './ReactBits/StarBorder';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container flex items-center justify-between">
        <div className="logo-container">
          <Link to="/" className="logo">
            <span className="logo-icon">Q</span>
            <span className="logo-text">Quick <span className="text-gradient">Space</span></span>
          </Link>
        </div>
        
        <nav className="nav-links">
          <a href="/#features" className="nav-link">Features</a>
          <a href="/#pricing" className="nav-link">Plans</a>
          <Link to="/register" className="nav-link">Register</Link>
        </nav>
        
        <div className="nav-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/login" className="nav-link" style={{ fontWeight: 600 }}>Login</Link>
          <Link to="/register" className="btn-primary">Get Your Space</Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
