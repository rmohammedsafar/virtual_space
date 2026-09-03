import React from 'react';

const Privacy = () => {
  return (
    <div className="privacy-container" style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', marginTop: '80px', color: '#e0e0e0', lineHeight: '1.6' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#ffffff' }}>Privacy Policy</h1>
      <p style={{ marginBottom: '2rem', color: '#a0a0a0' }}>Last updated: {new Date().toLocaleDateString()}</p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ffffff' }}>1. Introduction</h2>
        <p>
          At Quick Space, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our platform to discover and rent virtual environments.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ffffff' }}>2. Information We Do Not Collect</h2>
        <p>
          We firmly believe in data minimization. <strong>We do not use, sell, or process your personal information with or without proper consideration.</strong> We do not track your activity across other websites, nor do we sell your data to third-party advertising networks.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ffffff' }}>3. Information We Collect</h2>
        <p>
          To provide our services, we only collect the essential information necessary to facilitate your bookings and maintain your account security. This includes:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>Account credentials (such as your email address).</li>
          <li>Booking history and payment information (processed securely through our trusted payment gateways).</li>
          <li>Communications between you and our support team.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ffffff' }}>4. Data Security</h2>
        <p>
          We implement industry-standard security measures, including encryption and secure server hosting, to protect your personal information against unauthorized access, alteration, or disclosure.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ffffff' }}>5. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact our privacy team at <strong>privacy@quickspace.com</strong>.
        </p>
      </section>
    </div>
  );
};

export default Privacy;
