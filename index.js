const express = require('express');
const cors = require('cors');

const vehicleRoutes = require('./routes/vehicleRoute');
const connectDB = require('./utils/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/slots', require('./routes/slotRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/analytics', require('./routes/aggregationRoutes'));

// Start the server
const PORT = process.env.PORT || 4821;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});