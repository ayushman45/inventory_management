
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    customerId:{
        type: String,
        required: true
    },
    service:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now,
    }
    
});

export const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);