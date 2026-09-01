const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Space = require('../models/Space');
const User = require('../models/User');
const Rental = require('../models/Rental');

// Define the functions the AI can call
const functions = {
  getStats: async () => {
    const totalSpaces = await Space.count();
    const totalUsers = await User.count();
    const totalRentals = await Rental.count();
    return { totalSpaces, totalUsers, totalRentals };
  },
  getRecentSpaces: async (args) => {
    const limit = args?.limit || 5;
    const spaces = await Space.findAll({ limit, order: [['createdAt', 'DESC']] });
    return spaces.map(s => ({ id: s.id, name: s.name, status: s.status, price: s.monthlyPrice }));
  },
  getRecentUsers: async (args) => {
    const limit = args?.limit || 5;
    const users = await User.findAll({ limit, order: [['createdAt', 'DESC']] });
    return users.map(u => ({ id: u.id, email: u.email, role: u.role, phone: u.phone || 'N/A', companyName: u.companyName || 'N/A' }));
  },
  getRecentRentals: async (args) => {
    const limit = args?.limit || 5;
    const rentals = await Rental.findAll({ 
      limit, 
      order: [['createdAt', 'DESC']],
      include: [{ model: User }, { model: Space }]
    });
    return rentals.map(r => ({
      id: r.id, 
      planType: r.planType,
      status: r.status,
      user: r.User?.email,
      space: r.Space?.name
    }));
  }
};

const toolDeclarations = [
  {
    functionDeclarations: [
      {
        name: 'getStats',
        description: 'Get total counts of spaces, users, and rentals in the database.',
      },
      {
        name: 'getRecentSpaces',
        description: 'Get a list of the most recently added spaces.',
        parameters: {
          type: 'OBJECT',
          properties: {
            limit: {
              type: 'NUMBER',
              description: 'The maximum number of spaces to return. Default is 5.',
            }
          }
        }
      },
      {
        name: 'getRecentUsers',
        description: 'Get a list of the most recently registered users.',
        parameters: {
          type: 'OBJECT',
          properties: {
            limit: {
              type: 'NUMBER',
              description: 'The maximum number of users to return. Default is 5.',
            }
          }
        }
      },
      {
        name: 'getRecentRentals',
        description: 'Get a list of the most recent rental listings or active rentals.',
        parameters: {
          type: 'OBJECT',
          properties: {
            limit: {
              type: 'NUMBER',
              description: 'The maximum number of rentals to return. Default is 5.',
            }
          }
        }
      }
    ]
  }
];

router.post('/', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'GEMINI_API_KEY is missing.' });
    }

    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.6-flash",
      tools: toolDeclarations,
      systemInstruction: "You are an Admin Database Agent. You help the system administrator query the database. Use the provided tools. CRITICAL RULES: 1. NEVER use Markdown formatting (no asterisks, no bolding, no hashes). 2. ALWAYS format each record exactly on a single line, like this: • Name/Email (Role) - Details. 3. Do not add extra line breaks between related details."
    });
    let chatHistory = [];
    if (history && Array.isArray(history)) {
      chatHistory = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
    }

    const chat = model.startChat({ history: chatHistory });
    
    let result = await chat.sendMessage(message);
    
    // Handle function calls in a loop in case the model wants to call multiple functions
    let calls = result.response.functionCalls();
    let maxIterations = 5;
    while (calls && calls.length > 0 && maxIterations > 0) {
      maxIterations--;
      const call = calls[0]; // Process first call
      const functionName = call.name;
      const args = call.args;

      if (functions[functionName]) {
        try {
          const apiResponse = await functions[functionName](args);
          result = await chat.sendMessage(`System: The function ${functionName} executed successfully. Here is the returned data:\n${JSON.stringify(apiResponse)}\n\nCRITICAL INSTRUCTION: You now have the data. Do NOT call the function again. Stop thinking and immediately output your final response to the user.`);
        } catch (funcErr) {
           console.error("Function execution error:", funcErr);
           result = await chat.sendMessage(`System: The function ${functionName} failed to execute. Error: Failed to execute database query\n\nCRITICAL INSTRUCTION: Do NOT call this function again. Tell the user there was an error.`);
        }
      } else {
        // Unknown function
        result = await chat.sendMessage(`System: The function ${functionName} is unknown or not available.\n\nCRITICAL INSTRUCTION: Do NOT call this function again. Tell the user it is unavailable.`);
      }
      calls = result.response.functionCalls();
    }
    
    if (maxIterations === 0 && calls && calls.length > 0) {
       console.warn("Max function call iterations reached to prevent infinite loops.");
    }

    const text = result.response.text();
    res.json({ success: true, message: text });

  } catch (error) {
    console.error('Admin Agent Error:', error);
    res.status(500).json({ success: false, error: 'Failed to process agent request: ' + error.message });
  }
});

module.exports = router;
