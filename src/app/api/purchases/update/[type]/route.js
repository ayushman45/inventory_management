import { VendorPurchase } from "@/backendHelpers/models/vendorPurchase";
import { connectDB, disconnectDB } from "../../../db";
import { response } from "../../../handlers/sendToFrontEnd";
import { Product } from "@/backendHelpers/models/product";
import { Service } from "@/backendHelpers/models/service";
import { Purchase } from "@/backendHelpers/models/purchase";

export async function POST(req,{params}){
    try{
        await connectDB();
        let {type} = params;
        let data = await req.json();
        let purchase = data?.purchase;
        if(!purchase){
            return response({message: "Product Not Found"}, 404);
        }
        if (type === "vendor") {
            let purchaseObj = await VendorPurchase.findById(purchase._id);
            let product = await Product.findById(purchase.productId);
            if (purchaseObj && product) {
              product.quantity =
                parseInt(product.quantity) - parseInt(purchaseObj.quantity);
              product.quantity =
                parseInt(product.quantity) + parseInt(purchase.quantity);
              await product.save();
              purchaseObj.quantity = parseInt(purchase.quantity);
              purchaseObj.amount = parseInt(purchase.amount);
              await purchaseObj.save();
              return response({ message: "Edit Successful" },200);
            } else {
                return response({
                    message: "Product or Purchase Not Found",
                },404);
            }
        }
        else{
            let purchaseObj = await Purchase.findById(purchase._id);
            let product = purchaseObj.purchaseType === 'product'? await Product.findById(purchase.productId) : await Service.findById(purchase.serviceId);
            if (purchaseObj && product) {
            if(purchaseObj.purchaseType === 'product'){
                product.quantity =
                    parseInt(product.quantity) + parseInt(purchaseObj.quantity);
                product.quantity =
                    parseInt(product.quantity) - parseInt(purchase.quantity);
                await product.save();
    
                purchaseObj.quantity = parseInt(purchase.quantity);
                purchaseObj.totalValue = parseInt(purchase.totalValue);
                await purchaseObj.save();
    
            }
            else{
                purchaseObj.totalValue = parseInt(purchase.totalValue);
                await purchaseObj.save();
    
            }
    
            return response({ message: "Edit Successful" },200);
    
            } else {
                return response({
                    message: "Product or Purchase Not Found",
                },404);
    
            }
        }
        
    }
    catch(err){
        console.log(err.message);
        return response({message: "Internal Server Error"}, 500);
    }
    finally{
        await disconnectDB();
    }
}