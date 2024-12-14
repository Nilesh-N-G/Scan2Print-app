const firebaseAdmin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../serviceAccountKey.json'); // Path to Firebase service account key JSON
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token
  if (!token) {
    return res.status(401).send('Authorization token missing');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach user to request
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};


module.exports = verifyToken;
