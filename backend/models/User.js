// models/User.js
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Session = require('./Session'); // to handle session management

class User {

    // User Login (with JWT)
    static login(email, password, callback) {
        const query = `SELECT * FROM User WHERE email = ?`;
        db.query(query, [email], (err, result) => {
            console.log(email);
            if (err || result.length === 0) {
                return callback("User not found", null);
            }

            const user = result[0];

            // Compare password asynchronously
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err); // Debug the error in password comparison
                    return callback("Server error during password comparison", null);
                }

                // Generate JWT Token
                const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
                console.log(token);

                // Create session for user
                Session.createSession(null, user.id, token, (err, sessionResult) => {
                    if (err) return callback(err, null);
                    return callback(null, { user, token });
                });
            });
        });
    }

    // Get User Details (Get own details based on email)
    static getUserByEmail(email, callback) {
        const query = `SELECT * FROM User WHERE email = ?`;
        db.query(query, [email], callback);
    }
    

    // Update User Details (User can update their own details)
    static updateUser(userId, userData, callback) {
        const { firstName, lastName, email, phone } = userData;
        const query = `
            UPDATE User 
            SET first_name = ?, last_name = ?, email = ?, phone = ? 
            WHERE id = ?
        `;
        const values = [firstName, lastName, email, phone, userId];

        db.query(query, values, (err, result) => {
            if (err) {
                return callback(err);
            }
            callback(null, result);  // Returns the result of the update operation
        });
    }

    // User Logout (Invalidate session)
    static logout(token, callback) {
        Session.endSession(token, callback); // update session logout time
    }

    // Create User (Admin can create a new user)
    static createUser(data, callback) {
        const { first_name, last_name, email, password, phone } = data;
        if (!password) {
            return callback(new Error("Password is required for creating a user"));
        }
        console.log("Received password:", password);

        //const hashedPassword = bcrypt.hashSync(password, 10); // hash the password

        const query = `INSERT INTO User (first_name, last_name, email, password, phone) VALUES (?, ?, ?, ?, ?)`;
        //db.query(query, [first_name, last_name, email, hashedPassword, phone], callback);
        db.query(query, [first_name, last_name, email, password, phone], (err, result) => {
            if (err) {
                console.error("Error executing query:", err);  // Log the query error
                return callback(err);
            }
            callback(null, result);
        });
    }

    // Get All Users (Admin can fetch all users)
    static getAllUsers(callback) {
        const query = 'SELECT * FROM User';  // Adjust this based on your database schema

        db.query(query, (err, result) => {
            if (err) {
                return callback(err);
            }
            callback(null, result);  // Return all users from the database
        });
    }

    // Delete User (Admin can delete a user by ID)
    static deleteUser(userId, callback) {
        const query = `DELETE FROM User WHERE id = ?`;
        db.query(query, [userId], (err, result) => {
            if (err) {
                return callback(err);
            }
            callback(null, result);  // Returns the result of the delete operation
        });
    }
}

module.exports = User;
