require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("No API key found in .env");
    return;
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log("Fetching available models for your API key...");
    
    // Use the fetch API directly against the models endpoint using their key
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("\n=== AVAILABLE MODELS ===");
      data.models.forEach(model => {
        if (model.supportedGenerationMethods.includes("generateContent")) {
          console.log(`- ${model.name.replace('models/', '')}`);
        }
      });
      console.log("========================\n");
    } else {
      console.log("No models returned:", data);
    }
  } catch (error) {
    console.error("Failed to fetch models:", error);
  }
}

listModels();
