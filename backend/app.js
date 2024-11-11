
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const db = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const { authenticateToken } = require('./middleware/auth');  // Import the middleware if needed globally

dotenv.config();
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Use routes for different paths
app.use('/admin', adminRoutes);  // Admin routes protected by authentication
app.use('/user',  userRoutes);    // User routes protected by authentication

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

