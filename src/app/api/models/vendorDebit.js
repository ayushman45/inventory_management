import mongoose from "mongoose";

const vendorDebitSchema = new mongoose.Schema({
    vendorPurchase:{
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
        default: Date.now
    }

});

export const VendorDebit = mongoose.models.VendorDebit || mongoose.model("VendorDebit", vendorDebitSchema);