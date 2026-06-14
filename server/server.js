const dotenv = require('dotenv');
dotenv.config();

const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/slots', require('./routes/slotRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/temples', require('./routes/templeRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));

// Connect to MongoDB
connectDB();

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Darshan Ease API is running...' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
