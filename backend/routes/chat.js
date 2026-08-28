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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const systemInstruction = `
You are a helpful Customer Support Agent for "Quick Space", a platform where users can rent premium virtual environments and physical addresses for their businesses, events, and personal projects.
Keep your answers friendly, concise, and professional. 
Never discuss internal pricing strategies beyond what's publicly available (prices vary by space).
Always try to be helpful and guide users to register an account or browse active spaces.
`;

    // Convert history format if provided
    let chatHistory = [];
    if (history && Array.isArray(history)) {
      chatHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
    }

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: "SYSTEM INSTRUCTION (Read silently and act as this persona): " + systemInstruction }] },
        { role: 'model', parts: [{ text: "Understood! I am the Quick Space Customer Support Agent. How can I help you today?" }] },
        ...chatHistory
      ]
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
