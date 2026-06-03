const Vehicle = require('../models/Vehicle');

// Add a new vehicle
exports.addVehicle = async (req, res) => {
    try {
        const { vehicleNumber, ownerName, mobileNo, mobileNumber, vehicleType } = req.body;
        const actualMobileNo = mobileNo || mobileNumber;

        // Check if vehicle already exists
        const existingVehicle = await Vehicle.findOne({
            vehicleNumber: vehicleNumber.toUpperCase()
        });

        if (existingVehicle) {
            return res.status(400).json({ success: false, error: 'Vehicle already exists' });
        }

        const vehicle = await Vehicle.create({
            vehicleNumber: vehicleNumber.toUpperCase(),
            ownerName,
            mobileNo: actualMobileNo,
            vehicleType
        });
        return res.status(201).json({ success: true, message: 'Vehicle added successfully', data: vehicle });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

// Get all vehicles
exports.getVehicles = async (req, res) => {
    try {
        const allVehicles = await Vehicle.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, message: allVehicles.length, data: allVehicles });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

// Get single vehicle details
exports.getVehicleById = async (req, res) => {
    try {
        const objectId = req.params.id;
        const vehicle = await Vehicle.findById(objectId);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }
        return res.status(200).json({ success: true, data: vehicle });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

// Update vehicle details
exports.updateVehicle = async (req, res) => {
    try {
        const objectId = req.params.id;
        const { vehicleNumber, ownerName, mobileNo, mobileNumber, vehicleType } = req.body;
        const actualMobileNo = mobileNo || mobileNumber;

        const vehicle = await Vehicle.findById(objectId);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }

        // Update vehicle details
        if (vehicleNumber) vehicle.vehicleNumber = vehicleNumber.toUpperCase();
        if (ownerName) vehicle.ownerName = ownerName;
        if (actualMobileNo) vehicle.mobileNo = actualMobileNo;
        if (vehicleType) vehicle.vehicleType = vehicleType;

        await vehicle.save();
        return res.status(200).json({ success: true, message: 'Vehicle updated successfully', data: vehicle });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

// Delete a vehicle
exports.deleteVehicle = async (req, res) => {
    try {
        const objectId = req.params.id;
        const vehicle = await Vehicle.findById(objectId);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }
        await Vehicle.findByIdAndDelete(objectId);
        return res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}