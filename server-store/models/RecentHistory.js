const mongoose = require('mongoose');

const recentHistorySchema = new mongoose.Schema(
  {
    statement: { type: String, required: true },
    receivedBy: { type: String, required: true },
    timeOfUpload: { 
      type: Date, 
      default: Date.now, 
      index: { expires: 8640 } // TTL index for 1 day
    },
  },
  {
    collection: 'recenthistories',
  }
);

module.exports = mongoose.model('RecentHistory', recentHistorySchema);
