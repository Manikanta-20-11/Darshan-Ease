const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { processLazyUpdates } = require('../utils/bookingUtils');

// @desc    Book a darshan slot
// @route   POST /api/bookings
// @access  Protected
const bookDarshan = async (req, res) => {
  try {
    const { slotId } = req.body;

    const slot = await Slot.findById(slotId).populate('temple');
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.status === 'cancelled') return res.status(400).json({ message: 'This slot has been cancelled' });
    if (slot.bookedCount >= slot.maxVisitors) return res.status(400).json({ message: 'Slot is full' });

    const darshanToken = 'DE-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const booking = await Booking.create({
      user: req.user._id,
      slot: slotId,
      darshanToken,
    });

    slot.bookedCount += 1;
    await slot.save();

    // Crowd Capacity Alert (M9) - If reached >= 80% capacity
    const capacityPercent = slot.bookedCount / slot.maxVisitors;
    if (capacityPercent >= 0.8) {
      // In a real app, send to configured admin emails. Using a dummy/developer email here.
      const adminAlertHtml = `
        <h3>⚠️ Crowd Capacity Alert</h3>
        <p>Slot on <strong>${new Date(slot.date).toLocaleDateString()} (${slot.startTime}-${slot.endTime})</strong> at ${slot.temple?.name || 'General Temple'} has reached <strong>${Math.round(capacityPercent * 100)}% capacity</strong> (${slot.bookedCount}/${slot.maxVisitors}).</p>
      `;
      sendEmail('admin@darshanease.com', 'Alert: Slot Nearing Capacity', adminAlertHtml);
    }

    // Send booking confirmation email (non-blocking)
    const templeName = slot.temple?.name || 'the Temple';
    const slotDate = new Date(slot.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #FDBA74; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(90deg, #EA580C, #D97706); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">🛕 Darshan Ease</h1>
          <p style="color: #FEF3C7; margin: 8px 0 0;">Booking Confirmed!</p>
        </div>
        <div style="padding: 30px; background: #FFFDF5;">
          <p style="color: #374151;">Namaste <strong>${req.user.name}</strong>,</p>
          <p style="color: #374151;">Your darshan has been successfully booked. May you receive divine blessings!</p>
          <div style="background: white; border: 2px solid #FDBA74; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #9A3412; margin: 0 0 12px;">Booking Details</h3>
            <p style="margin: 6px 0;"><strong>Temple:</strong> ${templeName}</p>
            <p style="margin: 6px 0;"><strong>Date:</strong> ${slotDate}</p>
            <p style="margin: 6px 0;"><strong>Time:</strong> ${slot.startTime} – ${slot.endTime}</p>
            <div style="background: #FFF7ED; border: 1px solid #FDBA74; border-radius: 6px; padding: 12px; margin-top: 16px; text-align: center;">
              <p style="color: #6B7280; margin: 0 0 4px; font-size: 12px;">YOUR DARSHAN TOKEN</p>
              <p style="color: #EA580C; font-size: 24px; font-weight: bold; font-family: monospace; letter-spacing: 4px; margin: 0;">${darshanToken}</p>
            </div>
          </div>
          <p style="color: #6B7280; font-size: 13px;">Present this token at the temple entry gate.</p>
          <p style="color: #374151;">🙏 Jai Mata Di</p>
        </div>
      </div>
    `;
    sendEmail(req.user.email, `Darshan Booked — ${darshanToken}`, emailHtml);

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/mybookings
// @access  Protected
const getUserBookings = async (req, res) => {
  try {
    let bookings = await Booking.find({ user: req.user._id })
      .populate({ path: 'slot', populate: { path: 'temple', select: 'name' } })
      .sort({ bookingDate: -1 });

    // Apply lazy updates for completed status (M3)
    bookings = await processLazyUpdates(bookings);

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking (User initiated)
// @route   PUT /api/bookings/:id/cancel
// @access  Protected
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({ path: 'slot', populate: { path: 'temple', select: 'name' } });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized to cancel this booking' });
    if (booking.status !== 'confirmed') return res.status(400).json({ message: 'Only confirmed bookings can be cancelled' });

    // Check if slot is already in the past
    const slotDateTime = new Date(booking.slot.date);
    const [hours, minutes] = booking.slot.endTime.split(':');
    slotDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    if (slotDateTime < new Date()) return res.status(400).json({ message: 'Cannot cancel a booking for a past slot' });

    booking.status = 'cancelled';
    await booking.save();

    const slot = await Slot.findById(booking.slot._id);
    if (slot) {
      slot.bookedCount = Math.max(0, slot.bookedCount - 1);
      await slot.save();
    }

    // Send Cancellation Email
    const templeName = booking.slot.temple?.name || 'the Temple';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
        <div style="background: #F3F4F6; padding: 20px; text-align: center;">
          <h2 style="color: #374151; margin: 0;">Darshan Ease</h2>
        </div>
        <div style="padding: 30px;">
          <p>Namaste <strong>${req.user.name}</strong>,</p>
          <p>Your darshan booking for <strong>${templeName}</strong> on <strong>${new Date(booking.slot.date).toLocaleDateString()}</strong> has been successfully cancelled.</p>
          <p>We hope to welcome you again soon.</p>
        </div>
      </div>
    `;
    sendEmail(req.user.email, 'Booking Cancelled', emailHtml);

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookDarshan, getUserBookings, cancelBooking };
