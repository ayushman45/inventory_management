import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    customerId:{
        type: String,
        required: true
    },
    paymentFor:{
        type: String,
        enum :['service','fees','product']
    },
    amount:{
        type: Number,
        required: true
    },
    paymentType:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now,
    }
});

export const Payment = mongoose.models.Payment || mongoose.model('Payment',paymentSchema);