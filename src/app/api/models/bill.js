import mongoose from 'mongoose';


const billSchema = new mongoose.Schema({
    customerId:{
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

export const Bill = mongoose.models.Bill || mongoose.model('Bill', billSchema);