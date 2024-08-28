"use server";

import { connectDB, disconnectDB } from "../db";
import { Purchase } from "../models/purchase";
import { VendorPurchase } from "../models/vendorPurchase";
import { send } from "./sendToFrontEnd";
import { status } from "./status";

export async function getPurchase(req){
    try{
        await connectDB();
        let { purchaseId, type } = JSON.parse(req);
        console.log(req, purchaseId, type,"jus checkin");
        let purchase = type==="customer" ? await Purchase.findById(purchaseId) : await VendorPurchase.findById(purchaseId);
        console.log(purchase,"got it");
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