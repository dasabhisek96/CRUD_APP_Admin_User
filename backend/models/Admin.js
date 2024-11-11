// models/Admin.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Session = require('./Session'); // to handle session management

class Admin {
    // Admin Sign Up (Register)
    static signUp(data, callback) {
        const { first_name, last_name, email, password, phone } = data;
        const hashedPassword = bcrypt.hashSync(password, 10); // hash the password

        const query = `INSERT INTO Admin (first_name, last_name, email, password, phone) VALUES (?, ?, ?, ?, ?)`;
        db.query(query, [first_name, last_name, email, hashedPassword, phone], callback);
    }

    // Admin Login (with JWT)
    static login(email, password, callback) {
        const query = `SELECT * FROM Admin WHERE email = ?`;
        db.query(query, [email], (err, result) => {
            if (err || result.length === 0) {
                return callback("Admin not found", null);
            }

            const admin = result[0];

            // Compare password
            if (!bcrypt.compare(password, admin.password)) {
                return callback("Invalid password", null);
            }

            // Generate JWT Token
            const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            // Create session for admin
            Session.createSession(admin.id, null, token, (err, sessionResult) => {
                if (err) return callback(err, null);
                return callback(null, { admin, token });
            });
        });
    }

    // Admin Logout (Invalidate session)
    static logout(token, callback) {
        Session.endSession(token, callback); // update session logout time
    }

    // Create User (Admin can create a new user)
    static createUser(data, callback) {
        const { first_name, last_name, email, password, phone } = data;
        const hashedPassword = bcrypt.hashSync(password, 10); // hash the password

        const query = `INSERT INTO User (first_name, last_name, email, password, phone) VALUES (?, ?, ?, ?, ?)`;
        db.query(query, [first_name, last_name, email, hashedPassword, phone], callback);
    }

    // Get All Users (Admin can see all users)
    static getAllUsers(callback) {
        const query = `SELECT * FROM User`;
        db.query(query, callback);
    }

    // Get Single User (Admin can see a user by ID)
    static getUserById(id, callback) {
        const query = `SELECT * FROM User WHERE id = ?`;
        db.query(query, [id], callback);
    }

    // Update User (Admin can update any user's details)
    static updateUser(id, data, callback) {
        const query = `UPDATE User SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?`;
        db.query(query, [...data, id], callback);
    }

    // Delete User (Admin can delete a user)
    static deleteUser(id, callback) {
        const query = `DELETE FROM User WHERE id = ?`;
        db.query(query, [id], callback);
    }
}

module.exports = Admin;
