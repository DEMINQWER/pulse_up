const mongoose = require('mongoose');

const PulseUserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  lastPulseTime: { type: Date, default: Date.now },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }, // опционально
  },
});

PulseUserSchema.index({ location: '2dsphere' }); // для поиска рядом (опционально)

module.exports = mongoose.model('PulseUser', PulseUserSchema);