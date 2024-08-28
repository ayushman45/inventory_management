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
        type: String,
        default: new Date(Date.now()).toLocaleDateString()
    },
    user:{
        type: String,
        required: true
    }
});

export const Purchase = mongoose.models.Purchase || mongoose.model('Purchase',purchaseSchema);