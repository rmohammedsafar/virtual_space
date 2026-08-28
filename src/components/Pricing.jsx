import React from 'react';
import ShinyText from './ReactBits/ShinyText';
import StarBorder from './ReactBits/StarBorder';
import './Pricing.css';

const plans = [
  {
    name: "Starter",
    price: "₹29",
    period: "/month",
    features: ["Prime Business Address", "Mail Receipt", "Digital Mail Forwarding", "10% Meeting Room Discount"],
    buttonText: "Start Starter",
    popular: false
  },
  {
    name: "Professional",
    price: "₹79",
    period: "/month",
    features: ["Everything in Starter", "Local Phone Number", "Live Receptionist", "2 Free Meeting Room Hours/mo"],
    buttonText: "Get Professional",
    popular: true
  },
  {
    name: "Enterprise",
    price: "₹199",
    period: "/month",
    features: ["Everything in Pro", "Multiple Locations", "Dedicated Account Manager", "Unlimited Meeting Rooms"],
    buttonText: "Contact Sales",
    popular: false
  }
];

const Pricing = () => {
  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div className="section-header text-center" data-aos="fade-up">
          <h2 className="section-title">Transparent <span className="text-gradient">Pricing</span></h2>
          <p className="section-subtitle">Choose the perfect virtual space plan that fits your business needs.</p>
        </div>
        
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div 
              className={`pricing-card glass-panel ${plan.popular ? 'popular pulse-border' : ''}`} 
              key={index}
              data-aos="fade-right" 
              data-aos-delay={`${index * 150}`}
            >
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price-container">
                <span className="plan-price">{plan.price}</span>
                <span className="plan-period">{plan.period}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i} data-aos="fade-in" data-aos-delay={`${index * 150 + (i * 100) + 300}`}>
                    <span className="check-icon">✓</span> {feature}
                  </li>
                ))}
              </ul>
              {plan.popular ? (
                <button className="btn-primary full-width">
                  {plan.buttonText}
                </button>
              ) : (
                <button className="btn-secondary full-width">
                  {plan.buttonText}
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="pricing-matrix glass-panel" data-aos="fade-up" style={{ marginTop: '5rem', overflowX: 'auto' }}>
          <h3 className="text-center" style={{ marginBottom: '2rem', fontSize: '1.8rem' }}>
            <ShinyText text="Virtual Office Plans & Pricing Features" speed={3} className="inline-block" />
          </h3>
          <table className="matrix-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Virtual Office and Features</th>
                <th>Business Plan<br/><span style={{fontSize:'0.8rem', fontWeight: 'normal'}}>Starter</span></th>
                <th>APOB & PPOB Plan<br/><span style={{fontSize:'0.8rem', fontWeight: 'normal'}}>Professional</span></th>
                <th>Mailing Address Plan<br/><span style={{fontSize:'0.8rem', fontWeight: 'normal'}}>Basic</span></th>
                <th>Dedicated Desk Plan<br/><span style={{fontSize:'0.8rem', fontWeight: 'normal'}}>Enterprise</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Register the New Business Entity</td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="cross-icon">✗</span></td>
                <td><span className="check-icon">✓</span></td>
              </tr>
              <tr>
                <td>Update your Registered Address formally</td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="cross-icon">✗</span></td>
                <td><span className="check-icon">✓</span></td>
              </tr>
              <tr>
                <td>Use the Address for Opening a Bank Account</td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="cross-icon">✗</span></td>
                <td><span className="check-icon">✓</span></td>
              </tr>
              <tr>
                <td>Utilize Address for APOB & PPOB</td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="cross-icon">✗</span></td>
                <td><span className="check-icon">✓</span></td>
              </tr>
              <tr>
                <td>Courier Receiving and Forwarding Services</td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="check-icon">✓</span></td>
              </tr>
              <tr>
                <td>Meeting Room Access (T&C Apply)</td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="check-icon">✓</span></td>
                <td><span className="check-icon">✓</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
