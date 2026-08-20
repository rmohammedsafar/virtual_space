import React, { useState, useEffect } from 'react';
import './Navbar.css';

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
          <a href="#" className="logo">
            <span className="logo-icon">Q</span>
            <span className="logo-text">Quick <span className="text-gradient">Space</span></span>
          </a>
        </div>
        
        <nav className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Plans</a>
          <a href="#registration" className="nav-link">Register</a>
        </nav>
        
        <div className="nav-actions">
          <a href="#registration" className="btn-primary">Get Your Space</a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
