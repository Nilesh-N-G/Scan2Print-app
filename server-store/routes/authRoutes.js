const express = require('express');
const User = require('../models/User');
const Counter = require('../models/Counter');
const router = express.Router();

// Helper function to get the next unique ID
async function getNextUniqueId() {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'uniqueId' },
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true }
  );
  return counter.sequenceValue;
}

// Login or create user
router.post('/login', async (req, res) => {

    console.log("Entered login");
  try {
    const email = req.user.email;

    let user = await User.findOne({ email });
    if (!user) {
      await Counter.updateOne(
        { _id: 'uniqueId' },
        { $setOnInsert: { sequenceValue: 1011 } },
        { upsert: true }
      );

      const uniqueId = await getNextUniqueId();
      user = new User({ email, uniqueId, creationDate: new Date() });
      await user.save();
    }

    res.status(200).send({ message: 'User logged in successfully', user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error during login');
  }
});

module.exports = router;
