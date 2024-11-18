import mongoose from 'mongoose';


const billSchema = new mongoose.Schema({
    customerId:{
        type: String
    },
    studentId:{
        type: String,
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
        type: Date,
        default: Date.now
    }

});

export const Bill = mongoose.models.Bill || mongoose.model('Bill', billSchema);