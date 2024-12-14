const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 9000;

// MongoDB Connection
mongoose.connect('mongodb+srv://Nilesh:abc%40123@scan2printcluster.ddvpt.mongodb.net/Scan2PrintDB?retryWrites=true&w=majority&appName=Scan2PrintCluster')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define schema for file uploads
const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true }, 
  file: { type: Buffer, required: true },
  mimetype: { type: String, required: true }, 
  sentby: { type: String, required: true }, 
  receivedby: { type: String, required: false }, 
  timeofupload: {
    type: Date,
    required: true,
    default: Date.now, // Set default to current time
    index: { expires: 90000 }, // TTL index: Expire after 24 hours (in seconds)
  },
  hidden: { type: Boolean, default: false }, // Hidden field defaults to false
  status: { type: String, required: true },
});

// Create and export the model
const File = mongoose.model('File', fileSchema, 'files');


const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  uniqueId: {
    type: Number,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);


// Set up Multer for file uploads (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// File Upload Route
app.post('/upload', upload.array('files', 5), async (req, res) => {
  try {
    const { storeid, name } = req.body;
    const receivedby = storeid; 
    console.log(receivedby); 

    // Validate required fields
    if (!receivedby) {
      return res.status(400).json({ error: 'Receiver storeid is required.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    // Query the user by uniqueId (storeid in your case)
    const user = await User.findOne({ uniqueId: storeid });
    console.log(user);
    if (!user) {
      // console.log('No user found');
      return res.status(404).json({ error: 'Store not found! Invalid Store ID',message: 'Store not found'});
    }
    // console.log(user.email);

    // Get the current time in IST (India Standard Time)
    const timeofupload = new Date();
    const options = { timeZone: 'Asia/Kolkata' }; // IST timezone
    const istTime = new Date(timeofupload.toLocaleString('en-US', options));

    // Prepare file data for saving directly to MongoDB
    const filesToSave = req.files.map((file) => ({
      filename: file.originalname,
      file: file.buffer, // Use file.buffer directly
      mimetype: file.mimetype,
      sentby: name || 'Unknown', // Use dynamic user email if available
      receivedby: user.email,  // Use the found user's email
      timeofupload: istTime,   // Store upload time in IST
      hidden: false,
      status: 'pending',       // Set status to pending by default
    }));

    // Save files to MongoDB
    await File.insertMany(filesToSave);

    // Respond to client
    res.status(201).json({ message: 'Files uploaded and saved to MongoDB successfully!' });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: `Error uploading files: ${error.message}`});
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
