
// middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Session = require('../models/Session');  // Import Session model
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');

dotenv.config();

// Middleware to authenticate the token
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    // Check if the token is invalidated in the Session table
    Session.isTokenInvalid(token, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking token invalidity' });
        }

        // If the token is found in the session table with a logout_time, it's invalidated
        if (result.length > 0) {
            return res.status(403).json({ message: 'Token is invalidated. Please log in again.' });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            console.log(token);
            if (err) return res.status(403).json({ message: 'Invalid Token' });

            // Attach user data (id, role) to the request object
            req.user = user;
            next();  // Proceed to the next middleware or route handler
        });
    });
}

// Middleware to authorize based on user role
function authorizeRole(role) {
    return (req, res, next) => {
        // Check if the user has the required role
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Access Forbidden. Insufficient permissions.' });
        }
        next();  // Proceed to the next middleware or route handler
    };
}

module.exports = { authenticateToken, authorizeRole };
