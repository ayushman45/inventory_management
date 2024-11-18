import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    customerId:{
        type: String,
    },
    studentId:{
        type: String,
    },
   billId:{
        type: String,
        required: true
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
    },
    user:{
        type: String,
        required: true,
    },
});

export const Payment = mongoose.models?.Payment || mongoose.model('Payment',paymentSchema);