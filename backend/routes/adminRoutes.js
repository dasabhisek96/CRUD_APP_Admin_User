// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Admin routes

// Admin Sign Up
router.post('/signup', adminController.signup);  // Admin sign-up route

// Admin Login
router.post('/login', adminController.login);  // Admin login route

// Admin Logout (Protected)
router.post('/logout', authenticateToken, authorizeRole('admin'), adminController.logout);  // Only logged-in admins can log out

// Admin creates a new user (Protected)
router.post('/users', authenticateToken, authorizeRole('admin'), adminController.createUser);  // Only admins can create users

// Admin views all users (Protected)
router.get('/users', authenticateToken, authorizeRole('admin'), adminController.getAllUsers);  // Only admins can view users

// Admin updates user details (Protected)
router.put('/users/:id', authenticateToken, authorizeRole('admin'), adminController.updateUser);  // Only admins can update user details

// Admin deletes a user (Protected)
router.delete('/users/:id', authenticateToken, authorizeRole('admin'), adminController.deleteUser);  // Only admins can delete users

module.exports = router;

