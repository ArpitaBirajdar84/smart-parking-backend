const express = require('express');
const router = express.Router();

const {
    dailyRevenueAggregation,
    activeVehicleAggregation,
    completedVehicleAggregation,
    getAllPayments
} = require('../controllers/aggregationController');

router.get('/daily-revenue', dailyRevenueAggregation);
router.get('/active-vehicles', activeVehicleAggregation);
router.get('/completed-vehicles', completedVehicleAggregation);
router.get('/payments', getAllPayments);

module.exports = router;