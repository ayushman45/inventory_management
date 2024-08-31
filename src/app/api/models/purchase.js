import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    customerId:{
        type: String,
        required: true
    },
    productId:{
        type: String,
    },
    serviceId:{
        type: String,
    },
    description:{
        type: String,
        required: true,
    },
    purchaseType:{
        type: String,
        enum :['service','product'],
        required: true
    },
    quantity:{
        type: Number,
    },
    totalValue:{
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

export const Purchase = mongoose.models.Purchase || mongoose.model('Purchase',purchaseSchema);