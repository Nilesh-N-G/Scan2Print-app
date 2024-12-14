// server.js - Main entry point
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');
const fileRoutes = require('./routes/fileRoutes');
const qrRoutes = require('./routes/qrRoutes');
const authRoutes = require('./routes/authRoutes');
const historyRoutes = require('./routes/historyRoutes');
const { verifyToken } = require('./middlewares/authMiddleware');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: '*', // Allows requests from any origin
  credentials: true // Allows cookies, if needed
}));
app.use(express.json());

// MongoDB connection setup
mongoose
  .connect('mongodb+srv://Nilesh:abc%40123@scan2printcluster.ddvpt.mongodb.net/Scan2PrintDB?retryWrites=true&w=majority&appName=Scan2PrintCluster')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  console.log('Firebase Admin app already initialized');
}

// Routes
app.use('/files', verifyToken, fileRoutes);
app.use('/qr', verifyToken, qrRoutes);
app.use('/auth', verifyToken, authRoutes);
app.use('/history', verifyToken, historyRoutes);
// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
