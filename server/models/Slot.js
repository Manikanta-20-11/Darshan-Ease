const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    maxVisitors: {
      type: Number,
      required: true,
      default: 100,
    },
    bookedCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;
