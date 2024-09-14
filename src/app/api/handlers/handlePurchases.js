"use server";

import { connectDB, disconnectDB } from "../db";
import { Purchase } from "../../../backendHelpers/models/purchase";
import { VendorPurchase } from "../../../backendHelpers/models/vendorPurchase";
import { send } from "./sendToFrontEnd";
import { status } from "../../../backendHelpers/status";

export async function getPurchase(req){
    try{
        await connectDB();
        let { purchaseId, type } = JSON.parse(req);
        let purchase = type==="customer" ? await Purchase.findById(purchaseId) : await VendorPurchase.findById(purchaseId);
        if(purchase){
           return send( {status:status.SUCCESS, data:purchase} );
        }
        else{
           return send( {status:status.NOT_FOUND, message:"Purchase not found"} );
        }
    }catch(error){
        return send( {status:status.INTERNAL_SERVER_ERROR, message:error.message} );
    }finally{
        disconnectDB();
    }    
}