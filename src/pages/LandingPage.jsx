import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Registration from '../components/Registration';
import Footer from '../components/Footer';
import Guarantees from '../components/Guarantees';
import Stats from '../components/Stats';
import KYCDocuments from '../components/KYCDocuments';

const LandingPage = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        <Guarantees />
        <Stats />
        <Features />
        <KYCDocuments />
        <Pricing />
        <Registration />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
