const mongoose = require('mongoose');
const Slot = require('./models/Slot');
const Vehicle = require('./models/Vehicle');

mongoose.connect('mongodb+srv://arpitabirajdar123.db.user:84Arpitabirajdar@cluster0.ueiy5nn.mongodb.net/?appName=Cluster0');

const seedData = async () => {
  try {
    // Slots created
    const slots = [
      { slotNumber: 'A1', status: 'available', price: 50 },
      { slotNumber: 'A2', status: 'available', price: 50 },
      { slotNumber: 'B1', status: 'available', price: 60 },
      { slotNumber: 'B2', status: 'available', price: 60 },
      { slotNumber: 'C1', status: 'available', price: 70 },
    ];
    
    await Slot.deleteMany({});
    await Slot.insertMany(slots);
    console.log('✅ Slots added!');
    
    // Vehicles created
    const vehicles = [
      { vehicleNumber: 'MH12AB1234', vehicleType: 'Car', ownerName: 'John Doe' },
      { vehicleNumber: 'MH14CD5678', vehicleType: 'Bike', ownerName: 'Jane Smith' },
    ];
    
    await Vehicle.deleteMany({});
    await Vehicle.insertMany(vehicles);
    console.log('✅ Vehicles added!');
    
    console.log('🎉 Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
};

seedData();