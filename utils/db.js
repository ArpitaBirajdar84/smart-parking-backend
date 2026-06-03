const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://arpitabirajdar123_db_user:84Arpita@cluster0.uiey5nn.mongodb.net/?appName=Cluster0');
        console.log('Database connected...');
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;