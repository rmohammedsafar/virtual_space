import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Registration from './components/Registration';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <Registration />
      </main>
      <Footer />
    </div>
  );
}

export default App;
