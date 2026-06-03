const Vehicle = require('../models/Vehicle');
const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// Create a new booking
exports.vehicleEntry = async (req, res) => {
    try {
        const { vehicleId } = req.body;
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }
        // Check if the vehicle is already parked
        const activeBooking = await Booking.findOne({
            vehicleId,
            status: 'ACTIVE'
        })
        if (activeBooking) {
            return res.status(400).json({ success: false, message: 'Vehicle already parked' });
        }
        
        // Creating the new slot from the available slots
        const slot = await Slot.findOne({
            slotType: vehicle.vehicleType,
            status: 'AVAILABLE'
        });
        if (!slot) {
            return res.status(400).json({ success: false, message: 'No available slot for this vehicle type' });
        }
        slot.status = 'OCCUPIED';
        await slot.save();

        const booking = await Booking.create({
            vehicleId,
            slotId: slot._id
        });
        return res.status(201).json({
            success: true,
            message: 'Vehicle parked successfully',
            data: booking
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Vehicle exit and payment processing
exports.vehicleExit = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        if (booking.status === 'COMPLETED') {
            return res.status(400).json({ success: false, message: 'Vehicle already exited' });
        }
        const exitTime = new Date();
        const totalMiliseconds = exitTime - booking.entryTime;
        const totalHours = Math.ceil(totalMiliseconds / (1000 * 60 * 60));
        let amount = 50;
        if (totalHours > 2) {
            amount += (totalHours - 2) * 20;
        }
        booking.exitTime = exitTime;
        booking.totalHours = totalHours;
        booking.status = 'COMPLETED';
        await booking.save();
 
        const slot = await Slot.findById(booking.slotId);
        slot.status = 'AVAILABLE';
        await slot.save();

        const payment = await Payment.create({
            bookingId: booking._id,
            amount,
            paymentMethod: 'UPI'
        });
        return res.status(200).json({
            success: true,
            message: 'Vehicle exited successfully',
            totalHours,
            amount,
            payment
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }   
}
