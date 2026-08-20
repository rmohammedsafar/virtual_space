import React from 'react';
import './Pricing.css';

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    features: ["Prime Business Address", "Mail Receipt", "Digital Mail Forwarding", "10% Meeting Room Discount"],
    buttonText: "Start Starter",
    popular: false
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    features: ["Everything in Starter", "Local Phone Number", "Live Receptionist", "2 Free Meeting Room Hours/mo"],
    buttonText: "Get Professional",
    popular: true
  },
  {
    name: "Enterprise",
    price: "$199",
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
        <div className="section-header text-center">
          <h2 className="section-title">Transparent <span className="text-gradient">Pricing</span></h2>
          <p className="section-subtitle">Choose the perfect virtual space plan that fits your business needs.</p>
        </div>
        
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div className={`pricing-card glass-panel ${plan.popular ? 'popular' : ''}`} key={index}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price-container">
                <span className="plan-price">{plan.price}</span>
                <span className="plan-period">{plan.period}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, i) => (
                  <li key={i}>
                    <span className="check-icon">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button className={plan.popular ? 'btn-primary full-width' : 'btn-secondary full-width'}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
