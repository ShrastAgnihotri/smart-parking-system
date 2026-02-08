const ParkingSlot = require('../models/ParkingSlot');
const Vehicle = require('../models/Vehicle');

class Validators {
  /**
   * Validate parking slot data
   */
  static validateParkingSlot(data) {
    const errors = [];
    
    if (!data.slotNo || data.slotNo < 1) {
      errors.push('Valid slot number is required');
    }
    
    if (typeof data.isCovered !== 'boolean') {
      errors.push('isCovered must be boolean');
    }
    
    if (typeof data.isEVCharging !== 'boolean') {
      errors.push('isEVCharging must be boolean');
    }
    
    return errors;
  }

  /**
   * Validate vehicle data
   */
  static validateVehicle(data) {
    const errors = [];
    
    if (!data.vehicleNumber || data.vehicleNumber.trim().length === 0) {
      errors.push('Vehicle number is required');
    }
    
    if (typeof data.needsEV !== 'boolean') {
      errors.push('needsEV must be boolean');
    }
    
    if (typeof data.needsCover !== 'boolean') {
      errors.push('needsCover must be boolean');
    }
    
    return errors;
  }

  /**
   * Check if slot number already exists
   */
  static async checkSlotExists(slotNo) {
    const slot = await ParkingSlot.findOne({ slotNo });
    return !!slot;
  }

  /**
   * Check if vehicle already exists
   */
  static async checkVehicleExists(vehicleNumber) {
    const vehicle = await Vehicle.findOne({ vehicleNumber });
    return !!vehicle;
  }
}

module.exports = Validators;