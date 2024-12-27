const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fileRoutes = require('./routes/fileRoutes');
const { errorHandler } = require('./middlewares/errorHandler');

// Load environment variables
require('dotenv').config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());


// MongoDB connection setup
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/files', fileRoutes);

// Error handling middleware
app.use(errorHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  console.log(`Health check from IP: ${req.ip}, User-Agent: ${req.get('User-Agent')}`);
  res.status(200).send('K');
});


// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
