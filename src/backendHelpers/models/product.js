import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    company:{
        type:String,
    },
    quantity:{
        type: Number,
        default: 0,
    },
    description:{
        type:String,
    },
    user:{
        type: String,
        required: true
    }

});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);