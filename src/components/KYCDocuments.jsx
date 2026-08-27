import React, { useState } from 'react';
import { AuroraBackground } from './ReactBits/AuroraBackground';
import './KYCDocuments.css';

const kycData = {
  Individual: [
    "Aadhar Card Copy / Passport Copy",
    "PAN Card Copy",
    "One Passport Size Photo",
    "Cancelled Cheque / Passbook Front Page Copy"
  ],
  Partnership: [
    "Aadhar Card Copy / Passport Copy (All Partners)",
    "PAN Card Copy (All Partners)",
    "One Passport Size Photo (All Partners)",
    "Cancelled Cheque / Passbook Front Page Copy",
    "Business Registration Proof / Partnership Deed"
  ],
  Company: [
    "Certificate of Incorporation",
    "MOA and AOA",
    "Company PAN Card",
    "Directors' Aadhar and PAN Copies",
    "Board Resolution for Virtual Office"
  ]
};

const KYCDocuments = () => {
  const [activeTab, setActiveTab] = useState('Individual');

  return (
    <section className="kyc-section" id="kyc">
      <div className="container">
        <div className="section-header text-center" data-aos="fade-up">
          <h2 className="section-title">Required <span className="text-gradient">KYC Documents</span></h2>
        </div>
        
        <div className="kyc-container glass-panel">
          <div className="kyc-tabs">
            {Object.keys(kycData).map(tab => (
              <button 
                key={tab} 
                className={`kyc-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="kyc-content-wrapper">
            <div className="kyc-list">
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary-light)' }}>
                {activeTab === 'Partnership' ? 'LLP and Partnership Firms' : activeTab === 'Company' ? 'Private Limited & Public Companies' : 'Individuals & Freelancers'}
              </h3>
              <ul style={{ listStyle: 'none' }}>
                {kycData[activeTab].map((doc, index) => (
                  <li key={index} className="kyc-list-item" data-aos="fade-right" data-aos-delay={`${index * 100}`}>
                    <span className="check-icon" style={{ marginRight: '10px' }}>✓</span> {doc}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="kyc-image" data-aos="zoom-in">
              <div className="kyc-image-placeholder" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                  <AuroraBackground colorStops={['#00d4ff', '#0077ff', '#ff4757']} amplitude={1.5} speed={0.5} />
                </div>
                <div className="placeholder-text" style={{ position: 'relative', zIndex: 10, background: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: '8px', color: 'white' }}>
                  Secure Document Verification
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KYCDocuments;
