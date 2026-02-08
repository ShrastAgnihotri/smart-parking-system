const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    unique: true,
    trim: true
  },
  needsEV: {
    type: Boolean,
    default: false
  },
  needsCover: {
    type: Boolean,
    default: false
  },
  allocatedSlotNo: {
    type: Number,
    default: null
  },
  parkedAt: {
    type: Date,
    default: Date.now
  },
  leftAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);