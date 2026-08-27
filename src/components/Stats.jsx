import React from 'react';
import CountUp from './ReactBits/CountUp';
import Particles from './ReactBits/Particles';
import BlurText from './ReactBits/BlurText';
import './Stats.css';

const Stats = () => {
  return (
    <section className="stats-section" id="stats" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.5 }}>
        <Particles particleColors={['#ffffff', '#0077ff', '#00d4ff']} particleCount={150} particleSpread={10} speed={0.1} particleBaseSize={100} moveParticlesOnHover={true} alphaParticles={true} disableRotation={false} />
      </div>
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="stats-hero">
          <div className="stats-text" data-aos="fade-right">
            <h2>
              <BlurText text="One stop solution for all the" animateBy="words" delay={50} direction="top" className="inline-block" /> <span className="text-gradient">Virtual Office</span> <BlurText text="Solutions that you need." animateBy="words" delay={150} direction="bottom" className="inline-block" />
            </h2>
            <h3 style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Exactly What You're Looking For and Everything you Need.</h3>
            <p>The greatest advantage of a virtual office is that you can have it anywhere in the world without being actually present there. This is most advantageous to small and medium businesses, which don't have the financial means to start branch offices in cities and countries where there are ample business opportunities and customer queries keep flooding in.</p>
          </div>
          <div className="stats-venn" data-aos="fade-left">
            <div className="venn-circle circle-1">WORKSPACE</div>
            <div className="venn-circle circle-2">ADDRESS</div>
            <div className="venn-circle circle-3">ASSISTANT</div>
          </div>
        </div>
        
        <div className="stats-numbers">
          <div className="stat-box glass-panel" data-aos="fade-up" data-aos-delay="0">
            <div className="stat-icon">🏢</div>
            <div className="stat-number"><CountUp from={0} to={300} separator="," direction="up" duration={2} />+</div>
            <div className="stat-label">PAN India Locations</div>
          </div>
          <div className="stat-box glass-panel" data-aos="fade-up" data-aos-delay="100">
            <div className="stat-icon">😊</div>
            <div className="stat-number"><CountUp from={0} to={20} separator="," direction="up" duration={2} />K+</div>
            <div className="stat-label">Happy Clients</div>
          </div>
          <div className="stat-box glass-panel" data-aos="fade-up" data-aos-delay="200">
            <div className="stat-icon">🎧</div>
            <div className="stat-number">24/7</div>
            <div className="stat-label">Customer Support</div>
          </div>
          <div className="stat-box glass-panel" data-aos="fade-up" data-aos-delay="300">
            <div className="stat-icon">🗺️</div>
            <div className="stat-number"><CountUp from={0} to={28} separator="," direction="up" duration={2} /></div>
            <div className="stat-label">Presence in all States & UTs</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
