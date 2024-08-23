
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    serviceName:{
        type: String,
        required: true
    },
    type:{
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    user:{
        type: String,
        required: true
    }
    
});

export const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);