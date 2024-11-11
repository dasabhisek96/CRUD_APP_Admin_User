
// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const dotenv = require('dotenv');

dotenv.config();

// User Login
exports.login = (req, res) => {
    const { email, password } = req.body;

    User.login(email, password, (err, result) => {
        if (err) {
            return res.status(401).json({ message: err });
        }

        // Result contains the user and token if login is successful
        const { user, token } = result;

        res.json({ user, token });
    });
};

// User Logout
exports.logout = (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'Token missing' });

    // Invalidate the token by updating the session
    Session.endSession(token, (err) => {
        if (err) return res.status(500).json({ message: 'Error logging out' });
        res.json({ message: 'Logged out successfully' });
    });
};

// Middleware to check if the token is invalidated
exports.isTokenInvalid = (token) => {
    return Session.isTokenInvalid(token);  // Check the Session table if token is invalidated
};

// View Own Details
exports.viewOwnDetails = (req, res) => {
    const userId = req.user.id;  // user.id is added to the request by authentication middleware

    User.getUserById(userId, (err, result) => {
        if (err || result.length === 0) return res.status(500).json({ message: 'Error retrieving user details' });
        res.json(result[0]);
    });
};

// Update Own Details
// exports.updateOwnDetails = (req, res) => {
//     const userId = req.user.id;  // user.id is added to the request by authentication middleware
//     const { first_name, last_name, email, phone } = req.body;

//     User.updateUser(userId, [first_name, last_name, email, phone], (err) => {
//         if (err) return res.status(500).json({ message: 'Error updating user details' });
//         res.json({ message: 'Profile updated successfully' });
//     });
// };


exports.updateOwnDetails = (req, res) => {
    // Ensure the user is authenticated, the user ID is available in req.user (from token)
    const userId = req.user.id; // req.user is populated by the authentication middleware

    // Extract the updated details from the request body
    const { first_name, last_name, email, phone } = req.body;

    // Call the User model to update the user details
    User.updateUser(userId, [first_name, last_name, email, phone], (err, result) => {
        if (err) {
            // Handle errors such as database issues
            return res.status(500).json({ message: 'Error updating user details', error: err });
        }

        if (result.affectedRows === 0) {
            // If no rows were updated (possibly the user does not exist)
            return res.status(404).json({ message: 'User not found' });
        }

        // Successfully updated the user details
        res.json({ message: 'Profile updated successfully' });
    });
};
