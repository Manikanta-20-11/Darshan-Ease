const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    temple: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple' },
    message: { type: String, default: '' },
    paymentMethod: { type: String, enum: ['upi', 'card', 'netbanking', 'wallet'], default: 'upi' },
    status: { type: String, enum: ['pending', 'completed'], default: 'completed' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
