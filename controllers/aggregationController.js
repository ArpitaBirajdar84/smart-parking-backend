const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

exports.dailyRevenueAggregation = async (req, res) => {
    try {

        const data = await Payment.aggregate([
            {
                $group: {
                    _id: {
                        day: {
                            $dayOfMonth: "$paymentDate"
                        },
                        month: {
                            $month: "$paymentDate"
                        },
                        year: {
                            $year: "$paymentDate"
                        }
                    },
                    totalRevenue: {
                        $sum: "$amount"
                    },
                    totalPayments: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id.year": -1,
                    "_id.month": -1,
                    "_id.day": -1
                }
            }
        ])

        return res.status(200).json({
            success: true,
            data
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.activeVehicleAggregation = async (req, res) => {
    try {

        const data = await Booking.aggregate([
            {
                $match: {
                    status: "ACTIVE"
                }
            },
            {
                $lookup: {
                    from: "vehicles",
                    localField: "vehicleId",
                    foreignField: "_id",
                    as: "vehicle"
                }
            },
            {
                $lookup: {
                    from: "slots",
                    localField: "slotId",
                    foreignField: "_id",
                    as: "slot"
                }
            },
            {
                $project: {
                    entryTime: 1,

                    vehicleNumber: {
                        $arrayElemAt: [
                            "$vehicle.vehicleNumber", 0
                        ]
                    },

                    vehicleType: {
                        $arrayElemAt: [
                            "$vehicle.vehicleType", 0
                        ]
                    },

                    slotNumber: {
                        $arrayElemAt: [
                            "$slot.slotNumber", 0
                        ]
                    },

                    floor: {
                        $arrayElemAt: [
                            "$slot.floor", 0
                        ]
                    }
                }
            }
        ])

        return res.status(200).json({
            success: true,
            data
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.completedVehicleAggregation = async (req, res) => {
    try {

        const data = await Booking.aggregate([
            {
                $match: {
                    status: "COMPLETED"
                }
            },
            {
                $lookup: {
                    from: "vehicles",
                    localField: "vehicleId",
                    foreignField: "_id",
                    as: "vehicle"
                }
            },
            {
                $lookup: {
                    from: "slots",
                    localField: "slotId",
                    foreignField: "_id",
                    as: "slot"
                }
            },
            {
                $project: {
                    entryTime: 1,
                    exitTime: 1,
                    amount: 1,
                    totalHours: 1,

                    vehicleNumber: {
                        $arrayElemAt: [
                            "$vehicle.vehicleNumber", 0
                        ]
                    },

                    vehicleType: {
                        $arrayElemAt: [
                            "$vehicle.vehicleType", 0
                        ]
                    },

                    slotNumber: {
                        $arrayElemAt: [
                            "$slot.slotNumber", 0
                        ]
                    },

                    floor: {
                        $arrayElemAt: [
                            "$slot.floor", 0
                        ]
                    }
                }
            },
            {
                $sort: { exitTime: -1 }
            }
        ])

        return res.status(200).json({
            success: true,
            data
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getAllPayments = async (req, res) => {
    try {
        const { date, vehicleNumber, paymentMethod, page = 1, limit = 10 } = req.query;
        
        let matchStage = {};
        
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            matchStage.paymentDate = { $gte: startOfDay, $lte: endOfDay };
        }
        
        if (paymentMethod) {
            matchStage.paymentMethod = paymentMethod;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const pipeline = [
            { $match: matchStage },
            {
                $lookup: {
                    from: "bookings",
                    localField: "bookingId",
                    foreignField: "_id",
                    as: "booking"
                }
            },
            {
                $unwind: {
                    path: "$booking",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "vehicles",
                    localField: "booking.vehicleId",
                    foreignField: "_id",
                    as: "vehicle"
                }
            },
            {
                $unwind: {
                    path: "$vehicle",
                    preserveNullAndEmptyArrays: true
                }
            }
        ];

        if (vehicleNumber) {
            pipeline.push({
                $match: {
                    "vehicle.vehicleNumber": { $regex: vehicleNumber, $options: "i" }
                }
            });
        }

        const countPipeline = [...pipeline, { $count: "total" }];
        const countResult = await Payment.aggregate(countPipeline);
        const totalPayments = countResult.length > 0 ? countResult[0].total : 0;

        pipeline.push(
            { $sort: { paymentDate: -1 } },
            { $skip: skip },
            { $limit: parseInt(limit) },
            {
                $project: {
                    _id: 1,
                    amount: 1,
                    paymentMethod: 1,
                    paymentDate: 1,
                    totalHours: "$booking.totalHours",
                    vehicleNumber: "$vehicle.vehicleNumber"
                }
            }
        );

        const data = await Payment.aggregate(pipeline);

        return res.status(200).json({
            success: true,
            data,
            pagination: {
                total: totalPayments,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(totalPayments / parseInt(limit))
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}