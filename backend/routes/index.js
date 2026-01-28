const express = require('express');
const router = express.Router();

const chatbotRoutes = require('./chatbot');
router.use('/chatbot', chatbotRoutes);

router.get('/test', (req, res) => {
  console.log('API test route hit');
  res.json({ message: 'API routes are working!' });
});

module.exports = router;
