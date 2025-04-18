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
    },
    invoice:{
        type: String,
        default: "NA"
    },
    cgst:{
        type:Number,
        default: 0
    },
    sgst:{
        type:Number,
        default: 0
    }

});

export const Bill = mongoose.models.Bill || mongoose.model('Bill', billSchema);