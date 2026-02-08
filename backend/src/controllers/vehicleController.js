const ParkingService = require('../services/parkingService');
const Validators = require('../utils/validators');
const Helpers = require('../utils/helpers');

class VehicleController {
  // Park a vehicle
  static async parkVehicle(req, res, next) {
    try {
      const { vehicleNumber, needsEV, needsCover } = req.body;
      
      // Validate input
      const validationErrors = Validators.validateVehicle(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json(
          Helpers.formatResponse(false, null, validationErrors.join(', '))
        );
      }
      
      // Park vehicle
      const result = await ParkingService.parkVehicle({
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        needsEV: Boolean(needsEV),
        needsCover: Boolean(needsCover)
      });
      
      res.status(200).json(
        Helpers.formatResponse(true, result, `Vehicle parked at Slot ${result.slot.slotNo}`)
      );
    } catch (error) {
      next(error);
    }
  }

  // Remove vehicle (free slot)
  static async removeVehicle(req, res, next) {
    try {
      const { slotNo } = req.body;
      
      if (!slotNo) {
        return res.status(400).json(
          Helpers.formatResponse(false, null, 'Slot number is required')
        );
      }
      
      // Remove vehicle
      const result = await ParkingService.removeVehicle(Number(slotNo));
      
      res.status(200).json(
        Helpers.formatResponse(true, result, result.message)
      );
    } catch (error) {
      next(error);
    }
  }

  // Get all vehicles
  static async getAllVehicles(req, res, next) {
    try {
      const Vehicle = require('../models/Vehicle');
      const vehicles = await Vehicle.find()
        .sort({ parkedAt: -1 })
        .limit(50);
      
      res.status(200).json(
        Helpers.formatResponse(true, vehicles, 'Vehicles retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  // Generate demo vehicle number
  static async generateDemoVehicle(req, res, next) {
    try {
      const vehicleNumber = Helpers.generateVehicleNumber();
      res.status(200).json(
        Helpers.formatResponse(true, { vehicleNumber }, 'Demo vehicle number generated')
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VehicleController;