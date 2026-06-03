const Slot = require('../models/Slot');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

const getDashboardData = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const totalSlots = await Slot.countDocuments();
    const totalPayments = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const activeBookings = await Booking.find({ status: "active" })
      .populate("vehicleId")
      .populate("slotId");

    res.json({
      totalVehicles,
      totalSlots,
      totalPayments: totalPayments[0]?.total || 0,
      activeBookings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDashboardData };