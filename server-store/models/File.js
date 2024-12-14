const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  file: { type: Buffer, required: true },
  mimetype: { type: String, required: true },
  sentby: { type: String, required: true },
  receivedby: { type: String, required: false },
  timeofupload: {
    type: Date,
    required: true,
    default: Date.now,
    index: { expires: 86405 }, // TTL index for 1 day and 5 seconds
  },
  hidden: { type: Boolean, default: false },
  status: { type: String, required: true },
});

module.exports = mongoose.model('File', fileSchema);
