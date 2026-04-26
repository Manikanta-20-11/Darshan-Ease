const express = require('express');
const router = express.Router();
const { getTemples, getAllTemples, createTemple, updateTemple } = require('../controllers/templeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getTemples);                        // Public — active temples
router.get('/all', protect, admin, getAllTemples);   // Admin — all temples
router.post('/', protect, admin, createTemple);      // Admin — create
router.put('/:id', protect, admin, updateTemple);    // Admin — update

module.exports = router;
