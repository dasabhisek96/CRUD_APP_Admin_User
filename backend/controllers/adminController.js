
// controllers/adminController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Session = require('../models/Session');
const dotenv = require('dotenv');

dotenv.config();

// Admin Sign Up
exports.signup = async (req, res) => {
    const { first_name, last_name, email, password, phone } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Register admin
        Admin.signUp({ first_name, last_name, email, password: hashedPassword, phone }, (err) => {
            if (err) return res.status(500).json({ message: 'Error creating admin' });
            res.status(201).json({ message: 'Admin registered successfully' });
        });
    } catch (err) {
        res.status(500).json({ message: 'Error signing up admin' });
    }
};

// Admin Login
exports.login = (req, res) => {
    const { email, password } = req.body;

    Admin.login(email, password, (err, result) => {
        if (err) return res.status(401).json({ message: err });

        // Return JWT token
        const { admin, token } = result;
        res.json({ admin, token });
    });
};

// Admin Logout
exports.logout = (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'Token missing' });

    // Invalidate session for the given token
    Session.endSession(token, (err) => {
        if (err) return res.status(500).json({ message: 'Error logging out' });
        res.json({ message: 'Logged out successfully' });
    });
};

// Create User (Admin)
exports.createUser = (req, res) => {
    const { first_name, last_name, email, password, phone } = req.body;
    //const hashedPassword = bcrypt.hashSync(password, 10);
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    // Proceed to create the user
    User.createUser({ first_name, last_name, email, password, phone }, (err, result) => {
        if (err) {
            console.error("Error during user creation:", err);
            return res.status(500).json({ message: "Error creating user", error: err.message });
        }
        res.status(201).json({ message: "User created successfully", userId: result.insertId });
    });
};



exports.getAllUsers = (req, res) => {
    User.getAllUsers((err, users) => {
        if (err) {
            console.error('Error retrieving users:', err);
            return res.status(500).json({ message: 'Error retrieving users', error: err.message });
        }
        res.status(200).json({ message: 'Users retrieved successfully', users });
    });
};

// Update User Details (Admin)
exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone } = req.body;

    // Check for missing fields in the request body
    if (!first_name && !last_name && !email && !phone) {
        return res.status(400).json({ message: 'At least one field is required to update' });
    }

    // Prepare userData object with fields from the request
    const userData = {
        firstName: first_name || null,
        lastName: last_name || null,
        email: email || null,
        phone: phone || null
    };

    User.updateUser(id, userData, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating user', error: err });
        }
        res.json({ message: 'User updated successfully' });
    });
};

// Delete User (Admin)
exports.deleteUser = (req, res) => {
    const { id } = req.params;

    User.deleteUser(id, (err) => {
        if (err) return res.status(500).json({ message: 'Error deleting user' });
        res.json({ message: 'User deleted successfully' });
    });
};
