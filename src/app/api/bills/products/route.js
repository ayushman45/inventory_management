import { Purchase } from "@/backendHelpers/models/purchase";
import { connectDB, disconnectDB } from "../../db";
import { VendorPurchase } from "@/backendHelpers/models/vendorPurchase";
import { Product } from "@/backendHelpers/models/product";
import { Service } from "@/backendHelpers/models/service";
import { response } from "../../handlers/sendToFrontEnd";

export async function POST(req){
    try {
        let body = await req.json();
        let purchases = body.purchases;
        let type = body.type;
        await connectDB();

        let resStr = "";
  
      // Use a for...of loop to handle asynchronous calls in sequence
      for (const purchaseIdObj of purchases) {
        let purchaseId = purchaseIdObj.toString();
  
        let purchase =
          type === "customer"
            ? await Purchase.findById(purchaseId)
            : await VendorPurchase.findById(purchaseId);
  
        if (purchase) {
          if (purchase.purchaseType) {
            if (purchase.purchaseType === "product") {
              let product = await Product.findById(purchase.productId);
              if (product) {
                resStr += `${product.productName} $ ${purchase.quantity}, `;
              }
            } else {
              let service = await Service.findById(purchase.purchaseId);
              if (service) {
                resStr += `${service.serviceName}, `;
              }
            }
          } else {
            let product = await Product.findById(purchase.productId);
            if (product) {
              resStr += `${product.productName} $ ${purchase.quantity}, `;
            }
          }
        } 
      }

    if(resStr)
        return response({ summary: resStr },200);
    else
        return response({ message: "No products found" },404);

    } catch (error) {
        console.log(error.message);
        return response({message: "An error occurred while processing your request"},500)
    }
    finally{
        await disconnectDB();
    }
}