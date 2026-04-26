const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback, submitDonation, getAllDonations } = require('../controllers/feedbackController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, submitFeedback);              // User — submit feedback
router.get('/', protect, admin, getAllFeedback);         // Admin — all feedback
router.post('/donate', submitDonation);                 // Public — submit donation
router.get('/donations', protect, admin, getAllDonations); // Admin — all donations

module.exports = router;
