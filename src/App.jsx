import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import RentalsPage from './pages/RentalsPage';
import Privacy from './pages/Privacy';
import { Toaster } from 'react-hot-toast';

import { ContentProvider } from './context/ContentContext';
import Chatbot from './components/Chatbot';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <ContentProvider>
      <Router>
        <Toaster position="bottom-center" />
        <Chatbot />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/rent" element={<RentalsPage />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </Router>
    </ContentProvider>
  );
}

export default App;
