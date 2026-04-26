const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Slot',
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    darshanToken: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
