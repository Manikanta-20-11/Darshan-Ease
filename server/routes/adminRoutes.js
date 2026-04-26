const express = require('express');
const router = express.Router();
const { getAllBookings, getAllUsers, getTodayStats, adminCancelBooking, verifyToken } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/bookings', protect, admin, getAllBookings);
router.put('/bookings/:id/cancel', protect, admin, adminCancelBooking);
router.post('/verify', protect, admin, verifyToken);
router.get('/users', protect, admin, getAllUsers);
router.get('/stats', protect, admin, getTodayStats);

module.exports = router;
