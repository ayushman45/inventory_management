import mongoose from 'mongoose';
import { Purchase } from './purchase';


const billSchema = new mongoose.Schema({
    customerId:{
        type: String,
        required: true
    },
    purchases:{
        type: [Purchase],
        default:[]
    },
    user:{
        type: String,
        required: true
    }

});

export const Bill = mongoose.models.Bill || mongoose.model('Bill', productSchema);