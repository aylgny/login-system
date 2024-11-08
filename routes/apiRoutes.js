// routes/apiRoutes.js
const express = require('express');
const router = express.Router();

// Example: Login route
router.post('/login', (req, res) => {
  // Handle login logic
  res.json({ message: 'Login successful' });
});

// Example: Signup route
router.post('/signup', (req, res) => {
  // Handle signup logic
  res.json({ message: 'Signup successful' });
});

module.exports = router;