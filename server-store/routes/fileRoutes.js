const express = require('express');
const router = express.Router();
const File = require('../models/File');

// Get all files
router.get('/', async (req, res) => {
  try {
    const files = await File.find(
      { receivedby: req.user.email },
      'filename sentby mimetype timeofupload receivedby status _id'
    );
    res.json(files);
  } catch (error) {
    res.status(500).send('Error retrieving files');
  }
});

// Download file
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { operation } = req.query;
  try {
    const file = await File.findById(id);
    if (!file || file.receivedby !== req.user.email) {
      return res.status(403).send('Unauthorized');
    }
    if (operation === 'view' && file.status === 'pending') {
      file.status = 'viewed';
    } else if (operation === 'print') {
      file.status = 'printed';
    }
    await file.save();
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename=${file.filename}`);
    res.send(file.file);
  } catch (error) {
    res.status(500).send('Error retrieving file');
  }
});

// Delete file
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const file = await File.findById(id);
    if (!file || file.receivedby !== req.user.email) {
      return res.status(403).send('Unauthorized');
    }
    await File.findByIdAndDelete(id);
    res.status(200).send('File deleted');
  } catch (error) {
    res.status(500).send('Error deleting file');
  }
});

module.exports = router;
