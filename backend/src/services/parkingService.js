const ParkingSlot = require('../models/ParkingSlot');
const Vehicle = require('../models/Vehicle');
const AllocationService = require('./allocationService');

class ParkingService {
  /**
   * Add new parking slot
   */
  static async addParkingSlot(slotData) {
    try {
      // Check if slot number already exists
      const existingSlot = await ParkingSlot.findOne({ slotNo: slotData.slotNo });
      if (existingSlot) {
        throw new Error(`Slot number ${slotData.slotNo} already exists`);
      }
      
      const slot = new ParkingSlot(slotData);
      await slot.save();
      return slot;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all parking slots
   */
  static async getAllSlots() {
    try {
      return await ParkingSlot.find().sort({ slotNo: 1 });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Park a vehicle
   */
  static async parkVehicle(vehicleData) {
    try {
      const { vehicleNumber, needsEV, needsCover } = vehicleData;
      
      // Check if vehicle already parked
      const existingVehicle = await Vehicle.findOne({ 
        vehicleNumber, 
        allocatedSlotNo: { $ne: null } 
      });
      
      if (existingVehicle) {
        throw new Error(`Vehicle ${vehicleNumber} is already parked in slot ${existingVehicle.allocatedSlotNo}`);
      }
      
      // Find nearest matching slot
      const slot = await AllocationService.findNearestMatchingSlot(needsEV, needsCover);
      
      if (!slot) {
        throw new Error('No slot available matching your requirements');
      }
      
      // Allocate slot to vehicle
      await AllocationService.allocateSlotToVehicle(slot.slotNo, vehicleNumber);
      
      // Create vehicle record
      const vehicle = new Vehicle({
        vehicleNumber,
        needsEV,
        needsCover,
        allocatedSlotNo: slot.slotNo
      });
      
      await vehicle.save();
      
      return {
        slot,
        vehicle,
        message: `Vehicle parked successfully at Slot ${slot.slotNo}`
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove vehicle (free slot)
   */
  static async removeVehicle(slotNo) {
    try {
      // Free the slot
      const freedSlot = await AllocationService.freeSlot(slotNo);
      
      // Update vehicle record
      await Vehicle.findOneAndUpdate(
        { allocatedSlotNo: slotNo },
        { 
          allocatedSlotNo: null,
          leftAt: new Date()
        }
      );
      
      return {
        slot: freedSlot,
        message: `Slot ${slotNo} is now free`
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get parking statistics
   */
  static async getParkingStats() {
    try {
      const totalSlots = await ParkingSlot.countDocuments();
      const occupiedSlots = await ParkingSlot.countDocuments({ isOccupied: true });
      const availableSlots = totalSlots - occupiedSlots;
      const coveredSlots = await ParkingSlot.countDocuments({ isCovered: true });
      const evSlots = await ParkingSlot.countDocuments({ isEVCharging: true });
      
      return {
        totalSlots,
        occupiedSlots,
        availableSlots,
        coveredSlots,
        evSlots,
        occupancyRate: totalSlots > 0 ? (occupiedSlots / totalSlots * 100).toFixed(2) : 0
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ParkingService;