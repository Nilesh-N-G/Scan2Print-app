const File = require('../models/fileModel');
const User = require('../models/userModel');
const upload = require('../utils/upload');

// Upload file route handler
const uploadFiles = async (req, res) => {
  try {
    const { storeid, name } = req.body;
    const receivedby = storeid;

    if (!receivedby) {
      return res.status(400).json({ error: 'Receiver storeid is required.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const user = await User.findOne({ uniqueId: storeid });
    if (!user) {
      return res.status(404).json({ error: 'Store not found! Invalid Store ID' });
    }

    const timeofupload = new Date();
    const options = { timeZone: 'Asia/Kolkata' };
    const istTime = new Date(timeofupload.toLocaleString('en-US', options));

    const filesToSave = req.files.map((file) => ({
      filename: file.originalname,
      file: file.buffer,
      mimetype: file.mimetype,
      sentby: name || 'Unknown',
      receivedby: user.email,
      timeofupload: istTime,
      hidden: false,
      status: 'pending',
    }));

    await File.insertMany(filesToSave);

    res.status(201).json({ message: 'Files uploaded and saved to MongoDB successfully!' });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: `Error uploading files: ${error.message}` });
  }
};

module.exports = { uploadFiles };
