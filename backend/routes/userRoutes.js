// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// User login route
router.post('/login', userController.login);

// User logout route
router.post('/logout', authenticateToken, userController.logout);

// View own details
router.get('/profile', authenticateToken, userController.viewOwnDetails);

// Update own details
router.put('/profile', authenticateToken, userController.updateOwnDetails);

module.exports = router;

