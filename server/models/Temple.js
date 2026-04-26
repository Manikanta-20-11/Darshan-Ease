const mongoose = require('mongoose');

const templeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    deity: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Temple', templeSchema);
