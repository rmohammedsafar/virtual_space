const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Space = require('../models/Space');
const Rental = require('../models/Rental'); // Ensure Rental is imported

// Simple Login Route
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Verify password (plain text for now, TODO: use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Optional: Verify role if strict role-based login is needed
    if (user.role !== role) {
      return res.status(401).json({ success: false, error: `Account exists, but is not a ${role}` });
    }

    res.json({ 
      success: true, 
      user: { id: user.id, email: user.email, role: user.role }, 
      message: 'Logged in successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Registration Route
router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, role, companyName } = req.body;
    
    // Check if user already exists
    let existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    // Create the new user
    const newUser = await User.create({
      email,
      password, // In production, hash passwords
      role
      // Note: If you want to store companyName, you'd need to add it to the User model
    });

    res.json({ success: true, user: newUser, message: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all spaces
router.get('/spaces', async (req, res) => {
  try {
    const spaces = await Space.findAll();
    res.json({ success: true, spaces });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Dashboard Stats
router.get('/stats/admin', async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'user' } });
    const totalSellers = await User.count({ where: { role: 'seller' } });
    const activeSpaces = await Space.count();
    // In a real app, revenue would be calculated from payments. 
    // For now we just return a calculated mock value or 0.
    const revenue = activeSpaces * 500; 
    
    res.json({ success: true, data: { totalUsers, totalSellers, activeSpaces, revenue } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Seller Dashboard Stats
router.get('/stats/seller/:id', async (req, res) => {
  try {
    const sellerId = req.params.id;
    const spaces = await Space.findAll({ where: { sellerId } });
    
    // Mock earnings based on number of spaces
    const earnings = spaces.length * 850; 
    
    res.json({ success: true, data: { spaces, earnings, activeSpacesCount: spaces.length } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User Dashboard Stats
router.get('/stats/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const rentals = await Rental.findAll({ 
      where: { userId },
      include: [Space] // Include the related space info
    });
    
    res.json({ success: true, data: { rentals, activeRentalsCount: rentals.length } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
