
// firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBhdcXLP95wkxqNT4HOtgC6J58AM7LebCo",
  authDomain: "scan2print-c3f11.firebaseapp.com",
  projectId: "scan2print-c3f11",
  storageBucket: "scan2print-c3f11.firebasestorage.app",
  messagingSenderId: "824836325372",
  appId: "1:824836325372:web:1c231b31dc4ac697bf3c79",
  measurementId: "G-PR8L7X7MMP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Auth instance
const auth = getAuth(app);

export { auth };
