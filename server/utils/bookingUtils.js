const Booking = require('../models/Booking');

/**
 * Checks a list of bookings and updates their status to 'completed'
 * if the slot's end time has passed and they are currently 'confirmed'.
 * @param {Array} bookings - Array of populated booking documents
 * @returns {Array} - The array with updated statuses
 */
const processLazyUpdates = async (bookings) => {
  const now = new Date();
  const bookingsToUpdate = [];

  // Identify which bookings need updating
  const updatedBookings = bookings.map((booking) => {
    if (booking.status === 'confirmed' && booking.slot) {
      const slotDateTime = new Date(booking.slot.date);
      const [hours, minutes] = booking.slot.endTime.split(':');
      slotDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      if (slotDateTime < now) {
        booking.status = 'completed';
        bookingsToUpdate.push(booking._id);
      }
    }
    return booking;
  });

  // Update in database in the background (non-blocking for the response)
  if (bookingsToUpdate.length > 0) {
    Booking.updateMany(
      { _id: { $in: bookingsToUpdate } },
      { $set: { status: 'completed' } }
    ).catch((err) => console.error('Lazy update failed:', err));
  }

  return updatedBookings;
};

module.exports = { processLazyUpdates };
