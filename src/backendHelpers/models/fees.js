import mongoose from "mongoose";

const feesSchema = new mongoose.Schema({
    studentId:{
        type: String,
        required:true,
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
    batch:{
        type:String,
        required:true,
    },
    user:{
        type:String,
        required:true
    },
});

export const Fees = mongoose.models?.Fees || mongoose.model('Fees',feesSchema);