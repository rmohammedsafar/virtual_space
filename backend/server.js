require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/database');
const apiRoutes = require('./routes/api');
const paymentsRoutes = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);
app.use('/api/payments', paymentsRoutes);

// Sync Database and Start Server
const startServer = async () => {
  await connectDB();
  
  // Sync models with database (creates tables if they don't exist)
  // Use { force: true } only for development if you want to drop tables and recreate them
  try {
    const SiteContent = require('./models/SiteContent');
    await sequelize.sync();
    console.log('✅ Database models synchronized.');
    
    // Seed admin user if none exists
    const User = require('./models/User');
    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    if (!existingAdmin) {
      await User.create({ email: 'admin@quickspace.com', password: 'adminpassword', role: 'admin' });
      console.log('✅ Seeded default admin user (admin@quickspace.com)');
    }

    // Seed default CMS content if it doesn't exist
    const defaultContent = [
      { key: 'hero_title', value: 'Find Your Perfect\nVirtual Space' },
      { key: 'hero_subtitle', value: 'Rent premium virtual environments for your business, events, or personal projects. Explore top-rated spaces with seamless booking.' },
      { key: 'hero_cta', value: 'Explore Spaces' }
    ];

    for (const item of defaultContent) {
      const exists = await SiteContent.findOne({ where: { key: item.key } });
      if (!exists) {
        await SiteContent.create(item);
      }
    }
    console.log('✅ CMS content verified.');
  } catch (err) {
    console.error('❌ Failed to sync models:', err);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
  });
};

startServer();
