const express = require('express');
const RecentHistory = require('../models/RecentHistory');
const router = express.Router();

// Update recent history
router.post('/update', async (req, res) => {
  try {
    const { operation, filename } = req.body;

    if (!['print', 'delete'].includes(operation)) {
      return res.status(400).json({ error: 'Invalid operation type' });
    }

    const statement = `${operation === 'print' ? 'Printed' : 'Deleted'} ${filename}`;
    const recentHistoryEntry = new RecentHistory({
      statement,
      receivedBy: req.user.email,
    });

    await recentHistoryEntry.save();
    res.json({ message: 'Operation logged successfully', recentHistory: recentHistoryEntry });
  } catch (error) {
    console.error('Error updating recent history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
