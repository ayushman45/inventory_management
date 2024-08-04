import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    customerId:{
        type: String,
        required: true
    },
    productId:{
        type: String,
        required: true
    },
    totalValue:{
        type: Number,
        required: true
    }

});

export const Purchase = mongoose.models.Purchase || mongoose.model('Purchase',purchaseSchema);