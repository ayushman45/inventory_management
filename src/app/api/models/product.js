import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        default:0,
    },
    company:{
        type:String,
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