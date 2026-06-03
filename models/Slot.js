const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    slotNumber:{
        type:Number,
        unique:true,
        required:true
    },
    floor:{
        type:Number,
        required:true
    },
    slotType:{
        type:String,
        enum:['BIKE','CAR','TRUCK']
    },
    status:{
        type:String,
        enum:['AVAILABLE','OCCUPIED'],
        default:'AVAILABLE'
    }
},{
    timestamps:true
});

module.exports = mongoose.model('Slot',slotSchema);
