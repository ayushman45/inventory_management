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
        enum :['service','product']
    },
    totalValue:{
        type: Number,
        required: true
    },
    user:{
        type: String,
        required: true
    }
});

export const Purchase = mongoose.models.Purchase || mongoose.model('Purchase',purchaseSchema);