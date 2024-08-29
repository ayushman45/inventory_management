import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    dob: {
        type: Date
    },
    address: {
        type: String,
    },
    city: {
        type: String,
        required: true
    },
    membershipNumber: {
        type: String,
    },
    membershipActiveTill:{
        type: Date,
        default: null,
    },
    user:{
        type: String,
        required: true
    }
});

export const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);