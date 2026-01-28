const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log('Chatbot route loaded');

// Initialize Gemini AI
let genAI;
if (process.env.GEMINI_API) {
    try {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
        console.log('Gemini AI initialized successfully');
    } catch (error) {
        console.error('Error initializing Gemini AI:', error);
    }
} else {
    console.error('GEMINI_API key is missing. Chatbot may not function.');
}

// POST route for chatbot
router.post('/chat', async (req, res) => {
    console.log('POST /chat endpoint hit');
    try {
        const { message } = req.body;
        console.log('User message:', message);
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!genAI) {
            return res.status(500).json({ error: 'Chatbot service is not properly initialized' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `You are a parking assistant. Answer concisely: "${message}"`;

        console.log('Sending prompt:', prompt);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text) throw new Error('Empty response from Gemini API');
        
        return res.json({ response: text });

    } catch (error) {
        console.error('Error in chatbot:', error);
        return res.status(500).json({ error: 'Chatbot failed', details: error.message });
    }
});

module.exports = router;
