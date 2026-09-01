const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Space = require('../models/Space');
const SiteContent = require('../models/SiteContent');

router.post('/', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        error: 'AI is not configured yet. Please add your GEMINI_API_KEY in the Admin Settings.' 
      });
    }

    // Fetch dynamic platform context to make the AI aware of the actual website data
    const spaces = await Space.findAll({ limit: 15 });
    const content = await SiteContent.findAll();
    
    const availableSpacesContext = spaces.map(s => 
      `- ${s.name} located at ${s.address} (₹${s.monthlyPrice}/mo)`
    ).join('\n');

    let dynamicContentContext = '';
    content.forEach(c => {
      dynamicContentContext += `- ${c.key}: ${c.value}\n`;
    });

    const systemInstruction = `
You are a helpful Customer Support Agent for "Quick Space", a platform where users can rent premium virtual environments and physical addresses for their businesses, events, and personal projects.
Keep your answers friendly, concise, and professional. 
Never discuss internal pricing strategies beyond what's publicly available (prices vary by space).
Always try to be helpful and guide users to register an account or browse active spaces.

=== LIVE PLATFORM KNOWLEDGE ===
You have access to the following real-time data about the Quick Space platform. Use this information to answer user questions accurately!

Currently Available Spaces:
${availableSpacesContext || 'No spaces listed currently.'}

Website Text & Taglines:
${dynamicContentContext || 'No custom text configured.'}
=================================
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      systemInstruction: systemInstruction
    });

    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // Convert history format if provided
    let chatHistory = [];
    if (history && Array.isArray(history)) {
      // Gemini expects history to start with 'user' and strictly alternate.
      // Skip the initial 'model' greeting sent by the frontend UI.
      let validHistory = [...history];
      while (validHistory.length > 0 && validHistory[0].role === 'model') {
        validHistory.shift();
      }
      
      chatHistory = validHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
    }

    const chat = model.startChat({
      history: chatHistory
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ success: true, message: text });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ success: false, error: 'Failed to process AI chat: ' + error.message });
  }
});

module.exports = router;
