const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/vehicleController');

// Park vehicle
router.post('/park', VehicleController.parkVehicle);

// Remove vehicle
router.post('/remove', VehicleController.removeVehicle);

// Get all vehicles
router.get('/all', VehicleController.getAllVehicles);

// Generate demo vehicle number
router.get('/generate-demo', VehicleController.generateDemoVehicle);

module.exports = router;