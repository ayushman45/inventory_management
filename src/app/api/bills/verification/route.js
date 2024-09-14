import { headers } from "next/headers";
import { response } from "../../handlers/sendToFrontEnd";
import { Bill } from "@/backendHelpers/models/bill";
import { Purchase } from "@/backendHelpers/models/purchase";
import { VendorBill } from "@/backendHelpers/models/vendorBill";
import { VendorPurchase } from "@/backendHelpers/models/vendorPurchase";

export async function GET(req){
    let headerList = headers();
    let user = headerList.get("user");
    let billId = headerList.get("billId");
    let type = headerList.get("type");
    if(!user){
        return response({message:"Unauthorized access"}, 401);
    }
    if(!billId){
        return response({message:"Bill ID is required"}, 400);
    }
    if(!type){
        return response({message:"Type is required"}, 400);
    }
    if(type==="customer"){
        let bill = await Bill.findById(billId);
        if(!bill){
            return response({message:"Bill not found"}, 404);
        }
        let purchases = bill.purchases;
        let newPurchaseArray = [];
        for(let i=0; i<purchases.length; i++){
            let purchase = await Purchase.findById(purchases[i].toString());
            if(purchase){
                newPurchaseArray.push(purchase);
            }
        }
        bill.purchases = newPurchaseArray;
        if(newPurchaseArray.length === 0){
            await Bill.findByIdAndDelete(billId);
            return response({message:"Bill deleted successfully"}, 200);
        }
        await bill.save();
        return response({bill}, 200);
    }
    else{
        let bill = await VendorBill.findById(billId);
        if(!bill){
            return response({message:"Bill not found"}, 404);
        }
        let purchases = bill.purchases;
        let newPurchaseArray = [];
        for(let i=0; i<purchases.length; i++){
            let purchase = await VendorPurchase.findById(purchases[i].toString());
            if(purchase){
                newPurchaseArray.push(purchase);
            }
        }
        if(newPurchaseArray.length === 0){
            await VendorBill.findByIdAndDelete(billId);
            return response({message:"Bill deleted successfully"}, 200);
        }
        bill.purchases = newPurchaseArray;
        await bill.save();
        return response({bill}, 200);
    }
}