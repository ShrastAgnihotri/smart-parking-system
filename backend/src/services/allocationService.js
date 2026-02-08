const ParkingSlot = require('../models/ParkingSlot');

class AllocationService {
  /**
   * Find nearest available slot matching vehicle requirements
   * @param {boolean} needsEV - Vehicle needs EV charging
   * @param {boolean} needsCover - Vehicle needs covered parking
   * @returns {Promise<Object|null>} Matching slot or null
   */
  static async findNearestMatchingSlot(needsEV, needsCover) {
    try {
      // Build query based on requirements
      const query = { isOccupied: false };
      
      if (needsEV) query.isEVCharging = true;
      if (needsCover) query.isCovered = true;
      
      // Find all matching slots sorted by slot number (nearest)
      const matchingSlots = await ParkingSlot
        .find(query)
        .sort({ slotNo: 1 })
        .limit(10);
      
      if (matchingSlots.length === 0) {
        // If no exact match, try to find partial matches
        return await this.findPartialMatch(needsEV, needsCover);
      }
      
      return matchingSlots[0]; // Return nearest matching slot
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find partial match when exact match not available
   */
  static async findPartialMatch(needsEV, needsCover) {
    const query = { isOccupied: false };
    
    // Priority: EV requirement first, then cover requirement
    if (needsEV) {
      query.isEVCharging = true;
    } else if (needsCover) {
      query.isCovered = true;
    } else {
      // If no special requirements, return any available slot
      const anySlot = await ParkingSlot
        .find({ isOccupied: false })
        .sort({ slotNo: 1 })
        .limit(1);
      return anySlot[0] || null;
    }
    
    const slots = await ParkingSlot
      .find(query)
      .sort({ slotNo: 1 })
      .limit(1);
    
    return slots[0] || null;
  }

  /**
   * Allocate slot to vehicle
   */
  static async allocateSlotToVehicle(slotNo, vehicleNumber) {
    try {
      const slot = await ParkingSlot.findOne({ slotNo });
      
      if (!slot) {
        throw new Error('Slot not found');
      }
      
      if (slot.isOccupied) {
        throw new Error('Slot is already occupied');
      }
      
      slot.isOccupied = true;
      slot.vehicleNumber = vehicleNumber;
      await slot.save();
      
      return slot;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Free a slot
   */
  static async freeSlot(slotNo) {
    try {
      const slot = await ParkingSlot.findOne({ slotNo });
      
      if (!slot) {
        throw new Error('Slot not found');
      }
      
      if (!slot.isOccupied) {
        throw new Error('Slot is already free');
      }
      
      slot.isOccupied = false;
      slot.vehicleNumber = null;
      await slot.save();
      
      return slot;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AllocationService;