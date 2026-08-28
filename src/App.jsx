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
import ThemeToggle from './components/ThemeToggle';
import { Toaster } from 'react-hot-toast';

import { ContentProvider } from './context/ContentContext';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true, // whether animation should happen only once - while scrolling down
      offset: 100, // offset (in px) from the original trigger point
    });
  }, []);

  return (
    <ContentProvider>
      <Router>
        <Toaster position="bottom-center" />
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/rent" element={<RentalsPage />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </Router>
    </ContentProvider>
  );
}

export default App;
