
import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
    batchName:{
        type: String,
        required: true,
        unique: true

    },
    active: {
        type: Boolean,
        default: true   

    },
    startDate:{
        type: Date,
        default: Date.now
    },
    courseName:{
        type: String

    },
    fees:{
        type: Number,
        default:0
    },
    user:{
        type: String,
        required: true
    }
    
});

export const Batch = mongoose.models.Batch || mongoose.model("Batch", batchSchema);