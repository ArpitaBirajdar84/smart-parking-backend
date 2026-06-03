const express = require('express');
const router = express.Router();

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

module.exports = router;