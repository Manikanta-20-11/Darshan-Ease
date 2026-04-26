const express = require('express');
const router = express.Router();
const { bookDarshan, getUserBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, bookDarshan);
router.get('/mybookings', protect, getUserBookings);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
