const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
  slotNo: {
    type: Number,
    required: [true, 'Slot number is required'],
    unique: true,
    min: [1, 'Slot number must be positive']
  },
  isCovered: {
    type: Boolean,
    default: false
  },
  isEVCharging: {
    type: Boolean,
    default: false
  },
  isOccupied: {
    type: Boolean,
    default: false
  },
  vehicleNumber: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient querying
parkingSlotSchema.index({ slotNo: 1 });
parkingSlotSchema.index({ isOccupied: 1, isCovered: 1, isEVCharging: 1 });

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);