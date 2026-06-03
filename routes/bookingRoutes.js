const express = require('express');
const router = express.Router();

const { vehicleEntry, vehicleExit } = require('../controllers/bookingController');

router.post('/entry', vehicleEntry);
router.post('/exit/:bookingId', vehicleExit);

module.exports = router;
