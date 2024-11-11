// controllers/sessionController.js
const Session = require('../models/Session');

// Create Session (for login)
exports.createSession = (userId, token, role, res) => {
    // Create a new session when the user logs in
    Session.createSession(userId, token, role, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating session' });
        }
        // Respond with success message
        res.json({ message: 'Session created successfully', token });
    });
};

// End Session (for logout)
exports.endSession = (token, res) => {
    // Update session with logout time to invalidate token
    Session.endSession(token, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error ending session' });
        }
        // Respond with success message
        res.json({ message: 'Logged out successfully, session ended.' });
    });
};

// Check if token is invalid
exports.isTokenInvalid = (token, res) => {
    Session.isTokenInvalid(token, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking token invalidity' });
        }
        if (result.length > 0) {
            res.status(401).json({ message: 'Token is invalidated. Please log in again.' });
        } else {
            res.status(200).json({ message: 'Token is valid.' });
        }
    });
};
