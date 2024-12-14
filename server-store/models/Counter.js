const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  sequenceValue: {
    type: Number,
    required: true,
  },
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
