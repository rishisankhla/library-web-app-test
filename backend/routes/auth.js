const express = require('express');
const router = express.Router();
const admin = require('../firebaseAdmin');

// Authenticate user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCredential = await admin.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Check user role
router.get('/role', async (req, res) => {
  const { userId } = req.query;

  try {
    const userRecord = await admin.auth().getUser(userId);
    // Check user role (e.g., admin or reader)
    // For demonstration, assuming all users are readers
    const role = 'reader';
    res.json({ role });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user role', error });
  }
});

module.exports = router;
