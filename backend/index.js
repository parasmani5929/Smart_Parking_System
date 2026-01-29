const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const router = require("./routes");

dotenv.config();
const app = express();

// mongoDB databse connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// middlewares
app.use(cors({
  origin: ['http://localhost:5173'],  // Allow requests from both frontend ports
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// Basic routes
app.get("/", (req, res) => {
  res.send("Hello World! dear users");
});

app.get("/api", (req, res) => {
  res.send("API for Parking System in MERN!");
});

// Debug route to check if server is running
app.get("/api/debug", (req, res) => {
  console.log('Debug route hit');
  res.json({ message: "Debug route is working!" });
});

app.post("/api/chatbot", (req,res) =>{
  console.log("Connecting to chatbot");
})

// API routes
console.log('Setting up API routes...');
app.use('/api', router);
console.log('API routes setup complete. Available routes:');
console.log('- /api/chatbot/chat (POST)');
console.log('- /api/chatbot/test (GET)');

//start listening to the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Available endpoints:`);
  console.log(`- http://localhost:${port}/api`);
  console.log(`- http://localhost:${port}/api/debug`);
  console.log(`- http://localhost:${port}/api/chatbot/test`);
  console.log(`- http://localhost:${port}/api/chatbot/chat`);
});
