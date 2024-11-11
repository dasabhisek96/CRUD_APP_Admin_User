// models/Session.js
const db = require('../config/db');

class Session {
    // Create a new session (for login)
    static createSession(adminId, userId, token, callback) {
        const query = `INSERT INTO Session (admin_id, user_id, token) VALUES (?, ?, ?)`;
        db.query(query, [adminId || null, userId || null, token], callback);
    }

    // Update session for logout (set logout_time)
    static endSession(token, callback) {
        const query = `UPDATE Session SET logout_time = NOW() WHERE token = ?`;
        db.query(query, [token], callback);
    }

    // isTokenInvalid method to check if the token is invalidated
    static isTokenInvalid(token, callback) {
        const query = `SELECT * FROM Session WHERE token = ? `;
        db.query(query, [token], (err, results) => {
            if (err) return callback(err);
            // Return true if token is invalidated, otherwise false
            callback(null, results.length > 0);
        });
    }


}

module.exports = Session;
