import mongoose from "mongoose";

const vendorPurchaseSchema = new mongoose.Schema({
    vendor:{
        type: String,
        required: true
    },
    product:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

export const VendorPurchase = mongoose.models.VendorPurchase || mongoose.model("VendorPurchase", vendorPurchaseSchema);