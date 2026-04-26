const express = require('express');
const router = express.Router();
const { createSlot, getSlots, updateSlot, deleteSlot } = require('../controllers/slotController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getSlots);
router.post('/', protect, admin, createSlot);
router.put('/:id', protect, admin, updateSlot);
router.delete('/:id', protect, admin, deleteSlot);

module.exports = router;
