import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import { LiquidChrome } from './ReactBits/LiquidChrome';
import BlurText from './ReactBits/BlurText';
import { MapPin, Mail, Phone, Users, Shield, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero" id="home" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <LiquidChrome
          baseColor={[0.1, 0.15, 0.4]}
          speed={0.3}
          amplitude={0.6}
          interactive={true}
        />
        {/* Dark overlay for contrast */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(5, 10, 30, 0.6)', zIndex: 2 }}></div>
      </div>
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="hero-content text-center">
          <div className="badge" data-aos="fade-down" data-aos-duration="1000">
            <Zap size={14} style={{ marginRight: '6px', color: '#ffb347' }} /> FASTER • SMARTER • BEYOND
          </div>
          
          <h1 className="hero-title">
            <BlurText
              text="Claim Your Premium"
              delay={50}
              animateBy="words"
              direction="top"
              className="text-gradient"
            />
            <br />
            <BlurText
              text="Virtual Business Space"
              delay={50}
              animateBy="words"
              direction="bottom"
            />
          </h1>
          
          <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="500">
            Establish your business presence anywhere in the world. Register your company, 
            get a prestigious physical address, and manage your virtual space seamlessly.
          </p>
          
          <div className="hero-actions" data-aos="fade-up" data-aos-delay="600">
            <Link to="/register" className="btn-primary">Register Your Business</Link>
            <a href="#features" className="btn-secondary">Explore Features</a>
          </div>
          
          <div className="hero-mockup glass-panel" data-aos="zoom-in-up" data-aos-delay="700" data-aos-duration="1200">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span></span><span></span><span></span>
              </div>
              <div className="mockup-url">dashboard.quickspace.com</div>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="sidebar-icon active"><Shield size={18} /></div>
                <div className="sidebar-icon"><MapPin size={18} /></div>
                <div className="sidebar-icon"><Mail size={18} /></div>
                <div className="sidebar-icon"><Users size={18} /></div>
              </div>
              <div className="mockup-content">
                <div className="mockup-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                    <MapPin size={28} color="#4169e1" />
                  </div>
                  <div>
                    <div className="mockup-card-title">Active Space</div>
                    <div className="mockup-address">
                      123 Innovation Drive, Suite 400<br />
                      Silicon Valley, CA 94043
                    </div>
                  </div>
                </div>
                <div className="mockup-stats">
                  <div className="mockup-stat-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={24} color="#a0aec0" style={{ marginBottom: '8px' }} />
                    <span>2 New Mails</span>
                  </div>
                  <div className="mockup-stat-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={24} color="#a0aec0" style={{ marginBottom: '8px' }} />
                    <span>5 Missed Calls</span>
                  </div>
                  <div className="mockup-stat-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={24} color="#a0aec0" style={{ marginBottom: '8px' }} />
                    <span>1 Meeting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
