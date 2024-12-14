const express = require('express');
const QRCode = require('qrcode');
const User = require('../models/User');
const router = express.Router();

// Generate QR Code
router.get('/generate', async (req, res) => {
    console.log("Generating QR Code")
  const { email } = req.query;

  if (!email) {
    return res.status(400).send('Email is required to generate QR code.');
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    const uploadPageUrl = `https://scan2-print-app-upload.vercel.app/upload?storeid=${encodeURIComponent(user.uniqueId)}`;
    const qrCodeDataUrl = await QRCode.toDataURL(uploadPageUrl);

    res.status(200).json({ qrCodeDataUrl, uploadPageUrl });
  } catch (error) {
    console.error('Error generating QR code:', error);
    console.log("Error",error)
    res.status(500).send('Error generating QR code');
  }
});

module.exports = router;
