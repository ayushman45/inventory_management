import mongoose from "mongoose";

const vendorPurchaseSchema = new mongoose.Schema({
    vendorId:{
        type: String,
        required: true
    },
    productId:{
        type: String,
        required: true
    },
    productName:{
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
    },
    user:{
        type: String,
        required: true
    }
});

export const VendorPurchase = mongoose.models.VendorPurchase || mongoose.model("VendorPurchase", vendorPurchaseSchema);