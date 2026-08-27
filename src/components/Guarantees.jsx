import React from 'react';
import './Guarantees.css';

const guaranteesData = [
  { icon: '👨‍💼', title: 'Ensuring Customer Satisfaction with Dedicated CRM Executives' },
  { icon: '🎧', title: 'Your Department Questions Answered by Our Expert Team' },
  { icon: '💰', title: 'Full Refund Assurance with Our Hassle-Free Rejection Policy' },
  { icon: '🚀', title: 'Fastest Virtual Office Setup: 3 Working Days After KYC Approval' },
  { icon: '💲', title: 'Guaranteed Lowest Prices with Zero Hidden Charges' },
  { icon: '📝', title: 'User-Friendly Online Agreement: End-to-End Convenience' },
  { icon: '🔍', title: 'Thoroughly Vetted Documents for Seamless Address Registration' },
  { icon: '⭐', title: 'Hundreds of genuine users rated us 4.9 on Google in recent years.' }
];

const Guarantees = () => {
  return (
    <section className="guarantees" id="guarantees">
      <div className="container">
        <div className="section-header text-center" data-aos="fade-up">
          <h2 className="section-title">Your Solution <span style={{color: '#aaa', margin: '0 10px'}}>→</span> <span style={{color: '#27c93f'}}>On Time</span> <span style={{color: '#aaa', margin: '0 10px'}}>→</span> <span style={{color: '#ff4757'}}>Every Time</span></h2>
        </div>
        
        <div className="hexagon-grid">
          {guaranteesData.map((item, index) => (
            <div className="hexagon-wrapper" key={index} data-aos="fade-up" data-aos-delay={`${index * 50}`}>
              <div className="hexagon">
                <div className="hexagon-inner glass-panel">
                  <div className="hexagon-icon">{item.icon}</div>
                  <p className="hexagon-text">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Guarantees;
