const User = require('../models/User');
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const sendEmail = require('../utils/sendEmail');
const { processLazyUpdates } = require('../utils/bookingUtils');

// @desc    Get all bookings (system-wide)
// @route   GET /api/admin/bookings
// @access  Admin
const getAllBookings = async (req, res) => {
  try {
    let bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate({ path: 'slot', populate: { path: 'temple', select: 'name' } })
      .sort({ bookingDate: -1 });

    bookings = await processLazyUpdates(bookings);

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking (Admin initiated)
// @route   PUT /api/admin/bookings/:id/cancel
// @access  Admin
const adminCancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate({ path: 'slot', populate: { path: 'temple', select: 'name' } });
      
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'confirmed') return res.status(400).json({ message: 'Only confirmed bookings can be cancelled' });

    booking.status = 'cancelled';
    await booking.save();

    const slot = await Slot.findById(booking.slot._id);
    if (slot) {
      slot.bookedCount = Math.max(0, slot.bookedCount - 1);
      await slot.save();
    }

    const templeName = booking.slot.temple?.name || 'the Temple';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
        <div style="background: #EF4444; padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0;">Darshan Ease - Update</h2>
        </div>
        <div style="padding: 30px;">
          <p>Namaste <strong>${booking.user.name}</strong>,</p>
          <p>We regret to inform you that your darshan booking for <strong>${templeName}</strong> on <strong>${new Date(booking.slot.date).toLocaleDateString()}</strong> has been cancelled by the temple administration.</p>
          <p>Please contact the temple authorities for more details.</p>
        </div>
      </div>
    `;
    sendEmail(booking.user.email, 'Booking Cancelled by Administration', emailHtml);

    res.status(200).json({ message: 'Booking cancelled by admin', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Darshan Token
// @route   POST /api/admin/verify
// @access  Admin
const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is required' });

    const booking = await Booking.findOne({ darshanToken: token.toUpperCase() })
      .populate('user', 'name email')
      .populate({ path: 'slot', populate: { path: 'temple', select: 'name' } });

    if (!booking) return res.status(404).json({ message: 'Invalid Token: Booking not found' });
    
    // Auto-update to completed if confirmed, because they are verifying at the gate.
    if (booking.status === 'confirmed') {
      // Strictly speaking, we might only allow this on the actual date, but for demo:
      booking.status = 'completed';
      await booking.save();
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get today's booking stats + Peak Hours
// @route   GET /api/admin/stats
// @access  Admin
const getTodayStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayBookings = await Booking.countDocuments({
      bookingDate: { $gte: todayStart, $lte: todayEnd },
    });

    const totalBookings = await Booking.countDocuments({});
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalSlots = await Slot.countDocuments({});

    // Peak Hours Aggregation
    const peakHours = await Booking.aggregate([
      {
        $lookup: {
          from: 'slots',
          localField: 'slot',
          foreignField: '_id',
          as: 'slotData'
        }
      },
      { $unwind: '$slotData' },
      {
        $group: {
          _id: '$slotData.startTime',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 } // Top 5 peak hours
    ]);

    res.status(200).json({
      todayBookings,
      totalBookings,
      totalUsers,
      totalSlots,
      peakHours
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBookings,
  adminCancelBooking,
  verifyToken,
  getAllUsers,
  getTodayStats,
};
