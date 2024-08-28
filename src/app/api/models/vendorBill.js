import mongoose from 'mongoose';
import { Purchase } from './purchase';


const vendorBillSchema = new mongoose.Schema({
    vendorId:{
        type: String,
        required: true
    },
    purchases:{
        type: [],
        default:[]
    },
    user:{
        type: String,
        required: true
    },
    date:{
        type: String,
        default: new Date(Date.now()).toLocaleDateString()
    }

});

export const VendorBill = mongoose.models.VendorBill || mongoose.model('VendorBill', vendorBillSchema);