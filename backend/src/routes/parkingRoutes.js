const express = require('express');
const router = express.Router();
const ParkingSlotController = require('../controllers/parkingSlotController');

// Add parking slot
router.post('/add', ParkingSlotController.addParkingSlot);

// Get all slots
router.get('/all', ParkingSlotController.getAllSlots);

// Get statistics
router.get('/stats', ParkingSlotController.getStats);

// Delete slot
router.delete('/delete/:slotNo', ParkingSlotController.deleteSlot);

module.exports = router;