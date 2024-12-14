const express = require('express');
const upload = require('../utils/upload');
const { uploadFiles } = require('../controllers/fileController');

const router = express.Router();

// POST route for uploading files
router.post('/upload', upload.array('files', 5), uploadFiles);

module.exports = router;
