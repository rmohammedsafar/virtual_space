import React from 'react';
import './Features.css';

const featuresData = [
  {
    title: "Prestigious Address",
    description: "Get a premium physical business address in prime locations worldwide to build trust with your clients.",
    icon: "🏢"
  },
  {
    title: "Mail Handling",
    description: "We receive, scan, and forward your physical mail digitally so you never miss an important document.",
    icon: "✉️"
  },
  {
    title: "Dedicated Phone Line",
    description: "Local phone numbers with professional receptionists to answer calls in your company name.",
    icon: "📞"
  },
  {
    title: "Meeting Spaces",
    description: "Access to physical conference rooms when you need to meet clients in person at your virtual address.",
    icon: "🤝"
  }
];

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-header text-center mb-5">
          <h2 className="section-title">Why Choose <span className="text-gradient">Quick Space</span>?</h2>
          <p className="section-subtitle">Everything you need to run your business from anywhere, without the overhead of a physical office.</p>
        </div>
        
        <div className="features-grid">
          {featuresData.map((feature, index) => (
            <div className="feature-card glass-panel" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
