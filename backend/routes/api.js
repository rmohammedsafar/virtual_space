const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Space = require('../models/Space');
const Rental = require('../models/Rental'); // Ensure Rental is imported
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const { v4: uuidv4 } = require('uuid');
const OTP = require('../models/OTP');

// AWS S3 Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// AWS SNS Configuration for OTP
const sns = new SNSClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Simple Login Route
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Verify password (plain text for now, TODO: use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
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

// Send OTP via AWS SNS
router.post('/auth/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, error: 'Phone number is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes

    await OTP.upsert({ phone, otp, expiresAt });

    const command = new PublishCommand({
      PhoneNumber: phone,
      Message: `Your QuickSpace verification code is: ${otp}. It expires in 5 minutes.`
    });
    
    await sns.send(command);
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, error: 'Failed to send SMS' });
  }
});

// Phone Login Route
router.post('/auth/phone-login', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    if (!phoneNumber || !otp) {
      return res.status(400).json({ success: false, error: 'Phone number and OTP are required' });
    }

    const otpRecord = await OTP.findOne({ where: { phone: phoneNumber } });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(401).json({ success: false, error: 'Invalid OTP' });
    }
    if (new Date() > otpRecord.expiresAt) {
      return res.status(401).json({ success: false, error: 'OTP expired' });
    }

    await otpRecord.destroy(); // OTP used successfully
    
    let user = await User.findOne({ where: { phone: phoneNumber } });
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Phone number not registered. Please create an account.' });
    }

    res.json({ 
      success: true, 
      user: { id: user.id, email: user.email, role: user.role, phone: user.phone }, 
      message: 'Logged in successfully via Phone' 
    });
  } catch (error) {
    console.error('Phone login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Registration Route
router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, role, companyName, phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ success: false, error: 'Phone number and OTP are required for registration' });
    }

    const otpRecord = await OTP.findOne({ where: { phone } });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(401).json({ success: false, error: 'Invalid OTP' });
    }
    if (new Date() > otpRecord.expiresAt) {
      return res.status(401).json({ success: false, error: 'OTP expired' });
    }

    await otpRecord.destroy(); // valid, consume it

    let verifiedPhone = phone;
    
    // Check if user already exists
    let existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }
    
    if (verifiedPhone) {
      let existingPhone = await User.findOne({ where: { phone: verifiedPhone } });
      if (existingPhone) {
        return res.status(400).json({ success: false, error: 'User with this phone number already exists' });
      }
    }

    // Create the new user
    const newUser = await User.create({
      email,
      password, // In production, hash passwords
      role,
      phone: verifiedPhone
      // Note: If you want to store companyName, you'd need to add it to the User model
    });

    // Send a welcome email to the newly registered user
    const { sendEmail } = require('../utils/emailService');
    await sendEmail(
      email,
      'Welcome to Quick Space!',
      `<h1>Welcome, ${email.split('@')[0]}!</h1>
       <p>Your account has been successfully created.</p>
       <p>You can now log in and explore our spaces.</p>`
    );

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

// Create a new space
router.post('/spaces', upload.array('images', 5), async (req, res) => {
  try {
    const { name, address, monthlyPrice, sellerId, features } = req.body;
    
    // Upload images to S3
    const uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileKey = `spaces/${uuidv4()}-${file.originalname.replace(/\s+/g, '-')}`;
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype
        };
        await s3.send(new PutObjectCommand(uploadParams));
        uploadedImages.push(`https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`);
      }
    }

    const space = await Space.create({
      name,
      address,
      monthlyPrice,
      sellerId,
      features: features || [],
      images: uploadedImages,
      isVerified: false
    });

    // Fetch Seller to get email
    const seller = await User.findByPk(sellerId);
    if (seller) {
      const { sendEmail } = require('../utils/emailService');
      await sendEmail(
        seller.email,
        'Space Listed Successfully - Quick Space',
        `<h1>Congratulations!</h1>
         <p>Your space <strong>${space.name}</strong> has been listed successfully.</p>
         <p>Monthly Price: ₹${space.monthlyPrice}</p>
         <p>It will appear on the platform once approved.</p>`
      );
    }

    res.json({ success: true, space });
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

// Create a new rental
router.post('/rentals', async (req, res) => {
  try {
    const { userId, spaceId, planType } = req.body;
    
    // Check if space exists
    const space = await Space.findByPk(spaceId);
    if (!space) {
      return res.status(404).json({ success: false, error: 'Space not found' });
    }

    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const rental = await Rental.create({
      userId,
      spaceId,
      planType,
      status: 'active',
      nextBillingDate
    });

    res.json({ success: true, rental, message: 'Space rented successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all users for admin
router.get('/admin/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'role', 'createdAt']
    });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a user (Suspend)
router.delete('/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userToDelete = await User.findByPk(id);
    
    if (!userToDelete) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    if (userToDelete.role === 'admin') {
      return res.status(403).json({ success: false, error: 'Cannot suspend an administrator' });
    }

    await User.destroy({ where: { id } });
    res.json({ success: true, message: 'User suspended successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
// Update a user (Admin edit)
router.put('/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;
    
    const userToUpdate = await User.findByPk(id);
    if (!userToUpdate) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    await userToUpdate.update({ email, role });
    res.json({ success: true, message: 'User updated successfully', user: userToUpdate });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update a space (Admin edit)
router.put('/admin/spaces/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, monthlyPrice } = req.body;
    
    const spaceToUpdate = await Space.findByPk(id);
    if (!spaceToUpdate) {
      return res.status(404).json({ success: false, error: 'Space not found' });
    }
    
    await spaceToUpdate.update({ name, address, monthlyPrice });
    res.json({ success: true, message: 'Space updated successfully', space: spaceToUpdate });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a space (Admin edit)
router.delete('/admin/spaces/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const spaceToDelete = await Space.findByPk(id);
    
    if (!spaceToDelete) {
      return res.status(404).json({ success: false, error: 'Space not found' });
    }
    
    await spaceToDelete.destroy();
    res.json({ success: true, message: 'Space deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const SiteContent = require('../models/SiteContent');

// Get all site content
router.get('/content', async (req, res) => {
  try {
    const content = await SiteContent.findAll();
    // Convert array of {key, value} to a single object map
    const contentMap = content.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    res.json({ success: true, data: contentMap, raw: content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update site content (Admin)
router.put('/admin/content/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    let contentItem = await SiteContent.findOne({ where: { key } });
    if (contentItem) {
      await contentItem.update({ value });
    } else {
      contentItem = await SiteContent.create({ key, value });
    }
    
    res.json({ success: true, message: 'Content updated successfully', item: contentItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
