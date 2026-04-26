const Temple = require('../models/Temple');

// @desc Get all active temples
// @route GET /api/temples
const getTemples = async (req, res) => {
  try {
    const temples = await Temple.find({ status: 'active' }).sort({ name: 1 });
    res.status(200).json(temples);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all temples (including inactive) — Admin
// @route GET /api/temples/all
const getAllTemples = async (req, res) => {
  try {
    const temples = await Temple.find({}).sort({ createdAt: -1 });
    res.status(200).json(temples);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Create a temple — Admin
// @route POST /api/temples
const createTemple = async (req, res) => {
  try {
    const { name, location, description, imageUrl, deity } = req.body;
    const temple = await Temple.create({ name, location, description, imageUrl, deity });
    res.status(201).json(temple);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update a temple — Admin
// @route PUT /api/temples/:id
const updateTemple = async (req, res) => {
  try {
    const temple = await Temple.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!temple) return res.status(404).json({ message: 'Temple not found' });
    res.status(200).json(temple);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTemples, getAllTemples, createTemple, updateTemple };
