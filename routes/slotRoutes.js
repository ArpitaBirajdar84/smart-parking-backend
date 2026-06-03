const express = require('express');
const router = express.Router();

const { createSlot, getSlots, availableSlots, updateSlotStatus } = require('../controllers/slotController');

router.post('/create', createSlot);
router.get('/all', getSlots);
router.get('/available', availableSlots);
router.put('/update/:id', updateSlotStatus);

module.exports = router;
