const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

const { addVehicle, getVehicles, getVehicleById, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');

// Add a new vehicle
router.post('/add', addVehicle);

// Get all vehicles
router.get('/all', getVehicles);

// Get single vehicle details
router.get('/:id', getVehicleById);

// Update vehicle details
router.put('/update/:id', updateVehicle);

// Delete a vehicle
router.delete('/delete/:id', deleteVehicle);

router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;