const ParkingService = require('../services/parkingService');
const Validators = require('../utils/validators');
const Helpers = require('../utils/helpers');

class ParkingSlotController {
  // Add new parking slot
  static async addParkingSlot(req, res, next) {
    try {
      const { slotNo, isCovered, isEVCharging } = req.body;
      
      // Validate input
      const validationErrors = Validators.validateParkingSlot(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json(
          Helpers.formatResponse(false, null, validationErrors.join(', '))
        );
      }
      
      // Check if slot exists
      const slotExists = await Validators.checkSlotExists(slotNo);
      if (slotExists) {
        return res.status(400).json(
          Helpers.formatResponse(false, null, `Slot ${slotNo} already exists`)
        );
      }
      
      // Create slot
      const slot = await ParkingService.addParkingSlot({
        slotNo: Number(slotNo),
        isCovered: Boolean(isCovered),
        isEVCharging: Boolean(isEVCharging)
      });
      
      res.status(201).json(
        Helpers.formatResponse(true, slot, `Slot ${slotNo} added successfully`)
      );
    } catch (error) {
      next(error);
    }
  }

  // Get all parking slots
  static async getAllSlots(req, res, next) {
    try {
      const slots = await ParkingService.getAllSlots();
      
      // Format slots for display
      const formattedSlots = slots.map(Helpers.formatSlotStatus);
      
      res.status(200).json(
        Helpers.formatResponse(true, formattedSlots, 'Slots retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  // Get parking statistics
  static async getStats(req, res, next) {
    try {
      const stats = await ParkingService.getParkingStats();
      res.status(200).json(
        Helpers.formatResponse(true, stats, 'Statistics retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  // Delete a slot
  static async deleteSlot(req, res, next) {
    try {
      const { slotNo } = req.params;
      
      // Check if slot exists
      const slotExists = await Validators.checkSlotExists(Number(slotNo));
      if (!slotExists) {
        return res.status(404).json(
          Helpers.formatResponse(false, null, `Slot ${slotNo} not found`)
        );
      }
      
      // Delete slot (in real app, would have more checks)
      // For now, just remove
      const ParkingSlot = require('../models/ParkingSlot');
      await ParkingSlot.deleteOne({ slotNo: Number(slotNo) });
      
      res.status(200).json(
        Helpers.formatResponse(true, null, `Slot ${slotNo} deleted successfully`)
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ParkingSlotController;