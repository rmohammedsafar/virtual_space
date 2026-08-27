const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Rental = require('../models/Rental');
const Space = require('../models/Space');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: (process.env.RAZORPAY_KEY_ID || '').trim(),
  key_secret: (process.env.RAZORPAY_KEY_SECRET || '').trim(),
});

// Create Order Route (One-Time Payment)
router.post('/create-order', async (req, res) => {
  try {
    const { spaceId, planType } = req.body;
    
    const space = await Space.findByPk(spaceId);
    if (!space) {
      return res.status(404).json({ success: false, error: 'Space not found' });
    }

    // Calculate amount based on planType
    let amount = space.monthlyPrice;
    if (planType === 'yearly') {
      // 12 months with 30% discount
      amount = (space.monthlyPrice * 12) * 0.70;
    }

    const options = {
      amount: Math.round(amount * 100), // amount in paise (must be an integer)
      currency: 'INR',
      receipt: `receipt_space_${spaceId}_${Date.now()}`,
    };

    console.log("Razorpay Order Options:", options);

    const auth = Buffer.from(`${(process.env.RAZORPAY_KEY_ID || '').trim()}:${(process.env.RAZORPAY_KEY_SECRET || '').trim()}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Razorpay Fetch Error:", errText);
      return res.status(500).json({ success: false, error: 'Failed to create Razorpay order' });
    }

    const order = await response.json();

    res.json({ success: true, order, space, planType });
  } catch (error) {
    console.error("Razorpay Error:", error);
    const msg = error.error?.description || error.error || error.message || 'Unknown error';
    res.status(500).json({ success: false, error: msg });
  }
});

// Create Subscription Route (Autopay)
router.post('/create-subscription', async (req, res) => {
  try {
    const { spaceId } = req.body;
    
    const space = await Space.findByPk(spaceId);
    if (!space) {
      return res.status(404).json({ success: false, error: 'Space not found' });
    }

    const plan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: `Autopay for ${space.name}`,
        amount: Math.round(space.monthlyPrice * 100), // Must be an integer
        currency: "INR",
        description: "Monthly rental space"
      }
    });

    if (!plan) return res.status(500).json({ success: false, error: 'Failed to create plan' });

    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.id,
      customer_notify: 1,
      total_count: 120,
    });
    
    if (!subscription) return res.status(500).json({ success: false, error: 'Failed to create subscription' });

    res.json({ success: true, subscription, space });
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify Payment and Create Rental
router.post('/verify', async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_subscription_id,
      razorpay_payment_id, 
      razorpay_signature,
      userId,
      spaceId,
      planType
    } = req.body;

    const secret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
    
    // Check which signature to verify
    let body = "";
    if (razorpay_subscription_id) {
      body = razorpay_payment_id + '|' + razorpay_subscription_id;
    } else {
      body = razorpay_order_id + '|' + razorpay_payment_id;
    }

    const expectedSignature = crypto.createHmac('sha256', secret)
                                    .update(body.toString())
                                    .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const space = await Space.findByPk(spaceId);
      if (!space) {
        return res.status(404).json({ success: false, error: 'Space not found' });
      }

      const nextBillingDate = new Date();
      if (planType === 'yearly') {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      } else {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      }

      const rental = await Rental.create({
        userId,
        spaceId,
        planType: planType || 'Basic',
        status: 'active',
        nextBillingDate
      });

      // Fetch Renter to get email
      const User = require('../models/User');
      const renter = await User.findByPk(userId);
      if (renter) {
        const { sendEmail } = require('../utils/emailService');
        await sendEmail(
          renter.email, 
          'Payment Successful - Quick Space', 
          `<h1>Thank you for your purchase!</h1>
           <p>You have successfully rented space: <strong>${space.name}</strong>.</p>
           <p>Plan: <strong>${rental.planType}</strong></p>
           <p>Payment/Subscription ID: ${razorpay_order_id || razorpay_subscription_id}</p>`
        );
      }

      res.json({ success: true, rental, message: 'Payment verified and Space rented successfully' });
    } else {
      res.status(400).json({ success: false, error: 'Invalid Payment Signature' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Payment Failure Route
router.post('/failure', async (req, res) => {
  try {
    const { userId, spaceId, reason } = req.body;
    
    const User = require('../models/User');
    const user = await User.findByPk(userId);
    const space = await Space.findByPk(spaceId);

    if (user && space) {
      const { sendEmail } = require('../utils/emailService');
      await sendEmail(
        user.email,
        'Payment Failed - Quick Space',
        `<h1>Payment Failed</h1>
         <p>Hi ${user.email.split('@')[0]},</p>
         <p>Unfortunately, your payment for <strong>${space.name}</strong> failed.</p>
         <p>Reason provided: ${reason}</p>
         <p>Please try again with a different payment method.</p>`
      );
    }
    res.json({ success: true, message: 'Failure email sent' });
  } catch (error) {
    console.error('Failure email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
