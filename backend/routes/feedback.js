const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const emailService = require('../utils/emailService');

// POST /api/feedback - Submit new feedback
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, userId } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    // Save to database
    const feedback = await Feedback.create({
      name,
      email,
      subject,
      message,
      userId: userId || null
    });

    // Send email to admin
    const subjectLine = `New Feedback: ${subject}`;
    const htmlBody = `
      <h3>New Feedback from Quick Space</h3>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr />
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `;

    try {
      await emailService.sendEmail('t06546666@gmail.com', subjectLine, htmlBody);
      console.log('✅ Feedback email sent to t06546666@gmail.com via Lambda');
    } catch (emailError) {
      console.error('❌ Failed to send feedback email:', emailError);
      // We still return success since it was saved to the DB
    }

    res.status(201).json({ success: true, feedback });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ success: false, error: 'Failed to submit feedback' });
  }
});

// GET /api/feedback - Get all feedback for admin
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, feedbacks });
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch feedback' });
  }
});

// PUT /api/feedback/:id/read - Mark feedback as read
router.put('/:id/read', async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }
    
    feedback.status = 'read';
    await feedback.save();
    
    res.json({ success: true, feedback });
  } catch (err) {
    console.error('Error updating feedback:', err);
    res.status(500).json({ success: false, error: 'Failed to update feedback status' });
  }
});

module.exports = router;
