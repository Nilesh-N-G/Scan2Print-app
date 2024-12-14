const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  uniqueId: { type: Number, required: true },
  creationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
