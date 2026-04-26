const Feedback = require('../models/Feedback');
const Donation = require('../models/Donation');

// @desc Submit feedback
// @route POST /api/feedback
const submitFeedback = async (req, res) => {
  try {
    const { rating, message, temple, booking } = req.body;
    const feedback = await Feedback.create({
      user: req.user._id,
      rating,
      message,
      temple: temple || undefined,
      booking: booking || undefined,
    });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all feedback — Admin
// @route GET /api/feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({})
      .populate('user', 'name email')
      .populate('temple', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Submit a donation
// @route POST /api/feedback/donate
const submitDonation = async (req, res) => {
  try {
    const { donorName, email, amount, temple, message, paymentMethod } = req.body;
    const donation = await Donation.create({
      donorName,
      email,
      amount,
      temple: temple || undefined,
      message,
      paymentMethod,
    });
    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all donations — Admin
// @route GET /api/feedback/donations
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find({})
      .populate('temple', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitFeedback, getAllFeedback, submitDonation, getAllDonations };
