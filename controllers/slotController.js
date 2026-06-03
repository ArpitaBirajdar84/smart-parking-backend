const Slot = require('../models/Slot');

// Create a new parking slot
exports.createSlot = async (req, res) => {
    try {
        const { slotNumber, floor, slotType } = req.body;
        const existingSlot = await Slot.findOne({ slotNumber: slotNumber });
        if (existingSlot) {
            return res.status(400).json({ message: 'Slot number already exists' });
        }
        const slot = await Slot.create({ slotNumber, floor, slotType });
        return res.status(201).json({
            success: true,
            message: 'Slot created successfully',
        })

    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: error.message
         });
    }
};

// Get all parking slots
exports.getSlots = async (req, res) => {
    try {
        const slots = await Slot.find().sort({ floor: 1 });
        return res.status(200).json({
            success: true,
            message: 'Slots retrieved successfully',
            data: slots
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: error.message
         });
    }   
};

// Get available parking slots
exports.availableSlots = async (req, res) => {
    try {
        const { slotType } = req.query;
        const slots = await Slot.find({
            status: 'AVAILABLE',
            slotType: slotType
        })
        return res.status(200).json({
            success: true,
            message: 'Available slots retrieved successfully',
            data: slots
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: error.message
         });
    }   
};

// Update parking slot status
exports.updateSlotStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        const slot = await Slot.findByIdAndUpdate(
            id, 
            { status },
            { new: true }
        );
        return res.status(200).json({
            success: true,
            message: 'Slot updated successfully',
            data: slot
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: error.message
         });
    }
};