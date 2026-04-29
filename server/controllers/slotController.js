const Slot = require('../models/Slot');
// @desc  Create a new slot
// @route POST /api/slots
// @access Admin
const createSlot = async (req, res) => {
  try {
    const { date, startTime, endTime, maxVisitors, temple } = req.body;

    const slot = new Slot({
      date,
      startTime,
      endTime,
      maxVisitors,
      temple: temple || undefined,
    });

    const createdSlot = await slot.save();
    res.status(201).json(createdSlot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all slots for a date
// @route GET /api/slots
// @access Public
const getSlots = async (req, res) => {
  try {
    const { date, temple } = req.query;
    let query = {};

    if (date) {
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    if (temple) {
      query.temple = temple;
    }

    const slots = await Slot.find(query).populate('temple', 'name location').sort({ startTime: 1 });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update a slot (capacity or status)
// @route PUT /api/slots/:id
// @access Admin
const updateSlot = async (req, res) => {
  try {
    const { maxVisitors, status } = req.body;
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (maxVisitors !== undefined) slot.maxVisitors = maxVisitors;
    if (status !== undefined) slot.status = status;

    const updatedSlot = await slot.save();
    res.status(200).json(updatedSlot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a slot
// @route DELETE /api/slots/:id
// @access Admin
const deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findByIdAndDelete(req.params.id);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    res.status(200).json({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSlot,
  getSlots,
  updateSlot,
  deleteSlot,
};
