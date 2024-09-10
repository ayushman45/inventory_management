import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    vendorName:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },
    address:{
        type:String,
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
    },
    pincode:{
        type:String,
    },
    accountNumber:{
        type:String,
    },
    ifsc:{
        type:String,
    },
    bankName:{
        type:String,
    },
    user:{
        type: String,
        required: true
    }
})

export const Vendor = mongoose.models.Vendor || mongoose.model('Vendor',vendorSchema);