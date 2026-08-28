require('dotenv').config({ path: 'd:\\virtual space\\backend\\.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('No API key found in .env');
      return;
    }
    
    console.log('API Key found, testing Gemini...');
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const systemInstruction = "You are a test bot.";
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction
    });

    const chat = model.startChat({
      history: []
    });

    console.log('Sending message...');
    const result = await chat.sendMessage('hello');
    const response = await result.response;
    console.log('Response:', response.text());
  } catch (error) {
    console.error('ERROR OCCURRED:', error);
  }
}

run();
