const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const admin = require('firebase-admin');
const fileRoutes = require('./routes/fileRoutes');
const qrRoutes = require('./routes/qrRoutes');
const authRoutes = require('./routes/authRoutes');
const historyRoutes = require('./routes/historyRoutes');
const { verifyToken } = require('./middlewares/authMiddleware');

require('dotenv').config();


const app = express();
const server = http.createServer(app);



const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};


// Middleware
app.use(cors({
  origin: '*', 
  credentials: true 
}));
app.use(express.json());

// MongoDB connection setup
mongoose
  .connect(process.env.MONGO_URI)
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

// Health check endpoint
app.get('/health', (req, res) => {
  console.log(`Health check from IP: ${req.ip}, User-Agent: ${req.get('User-Agent')}`);
  res.status(200).send('K');
});


// Error handling middleware (should be added after all routes)
app.use((err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.url}: ${err.message}`);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});



const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
