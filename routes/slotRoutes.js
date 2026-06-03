const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');

const { createSlot, getSlots, availableSlots, updateSlotStatus } = require('../controllers/slotController');

router.post('/create', createSlot);
router.get('/all', getSlots);
router.get('/available', availableSlots);
router.put('/update/:id', updateSlotStatus);

router.get('/', async (req, res) => {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
