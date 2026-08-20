import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-content text-center">
          <div className="badge animate-fade-in-up">
            <span className="badge-dot"></span> FASTER • SMARTER • BEYOND
          </div>
          
          <h1 className="hero-title animate-fade-in-up delay-1">
            Claim Your <span className="text-gradient">Premium</span><br />
            Virtual Business Space
          </h1>
          
          <p className="hero-subtitle animate-fade-in-up delay-2">
            Establish your business presence anywhere in the world. Register your company, 
            get a prestigious physical address, and manage your virtual space seamlessly.
          </p>
          
          <div className="hero-actions animate-fade-in-up delay-3">
            <a href="#registration" className="btn-primary">Register Your Business</a>
            <a href="#features" className="btn-secondary">Explore Features</a>
          </div>
          
          <div className="hero-mockup animate-fade-in-up delay-4 glass-panel">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span></span><span></span><span></span>
              </div>
              <div className="mockup-url">dashboard.quickspace.com</div>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar"></div>
              <div className="mockup-content">
                <div className="mockup-card">
                  <div className="mockup-card-title">Active Space</div>
                  <div className="mockup-address">
                    123 Innovation Drive<br />
                    Suite 400<br />
                    Silicon Valley, CA 94043
                  </div>
                </div>
                <div className="mockup-stats">
                  <div className="mockup-stat-box"></div>
                  <div className="mockup-stat-box"></div>
                  <div className="mockup-stat-box"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>
    </section>
  );
};

export default Hero;
