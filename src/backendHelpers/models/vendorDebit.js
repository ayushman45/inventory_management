import mongoose from "mongoose";

const vendorDebitSchema = new mongoose.Schema({
    billId:{
        type: String,
        required: true
    },

    vendorId:{
        type: String,
        required: true
    },

    amount:{
        type: Number,
        required: true
    },

    paymentType:{
        type: String,
    },

    date:{
        type: Date,
        default: Date.now
    },
    user:{
        type: String,
        required: true,
    }

});

export const VendorDebit = mongoose.models?.VendorDebit || mongoose.model("VendorDebit", vendorDebitSchema);