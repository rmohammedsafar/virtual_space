const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        error: 'AI is not configured yet. Please add your GEMINI_API_KEY in the Admin Settings.' 
      });
    }

    const systemInstruction = `
You are a helpful Customer Support Agent for "Quick Space", a platform where users can rent premium virtual environments and physical addresses for their businesses, events, and personal projects.
Keep your answers friendly, concise, and professional. 
Never discuss internal pricing strategies beyond what's publicly available (prices vary by space).
Always try to be helpful and guide users to register an account or browse active spaces.
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
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
    res.status(500).json({ success: false, error: 'Failed to process AI chat. Please try again later.' });
  }
});

module.exports = router;
