const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'booking'
    },
    amount:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        enum:['CASH','CARD','UPI'],
        required:true
    },
    paymentDate:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
});

paymentSchema.index({
    paymentDate:-1
})

module.exports = mongoose.model('Payment',paymentSchema);