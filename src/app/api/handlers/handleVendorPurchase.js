"use server";

import { connectDB, disconnectDB } from "../db";
import { status } from "../../../backendHelpers/status";
import { send } from "./sendToFrontEnd";
import { Vendor } from "../../../backendHelpers/models/vendor";
import { VendorPurchase } from "../../../backendHelpers/models/vendorPurchase";
import { VendorBill } from "../../../backendHelpers/models/vendorBill";
import { Product } from "../../../backendHelpers/models/product";
import { Bill } from "../../../backendHelpers/models/bill";

export async function createVendorBill(req) {
    try {
        await connectDB();
        let { user, purchases, date, vendorId } = JSON.parse(req);
        if (!user) {
            return send({ status:status.FORBIDDEN, message:"Unauthorized access"});
        }
        let vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return send({ status:status.ERROR, message:"Vendor not found"});
        }
        let purchasesArr=[]
        //create new Purchases from purchaes array
        for(let i = 0; i < purchases.length; i++) {
            let temp = new VendorPurchase(purchases[i]);

            let product = await Product.findById(purchases[i].productId);
            let quantity = product?.quantity || 0;
            if(!product){
                //delete all the already made purchases
                for(let j = 0; j < i; j++){
                    await VendorPurchase.findByIdAndDelete(purchasesArr[j]._id);
                }
                return send({ status:status.ERROR, message:"Product not found"});

            }
            else{
                try{
                    quantity += parseInt(purchases[i].quantity);

                }
                catch(err){
                    console.log(err.message)
                   quantity = parseInt(purchases[i].quantity);

                }
               
                product = await Product.findByIdAndUpdate(purchases[i].productId, {quantity});

            }
            if(!temp){
                //delete all the already made purchases
                for(let j = 0; j < i; j++){
                    await VendorPurchase.findByIdAndDelete(purchasesArr[j]._id);
                }
                return send({ status:status.ERROR, message:"Invalid purchase data"});

            }
            purchasesArr.push(temp._id);
            await temp.save();

        }

        let bill = new VendorBill({
            vendorId,
            date,
            purchases: purchasesArr,
            user
        });

        await bill.save();
        await disconnectDB();
        return send({status:status.SUCCESS, data:bill});
    } catch (error) {
        console.error(error.message);
        await disconnectDB();
        return send({ status:status.INTERNAL_SERVER_ERROR, message: "An error occurred while processing your request" });
    }
}

export async function getVendorForBill(req){
    try{
        await connectDB();
        let { billId } = JSON.parse(req);
        let bill = await VendorBill.findById(billId);
        if(!bill){
            return send({ status:status.ERROR, message:"Vendor not found"});
        }
        return send({status:status.SUCCESS, data:bill.vendorId});
    } catch (error) {
        return send({ status:status.INTERNAL_SERVER_ERROR, message: "An error occurred while processing your request" });
    }
    finally{
        await disconnectDB();
    }
}

export async function getCustomerForBill(req){
    try{
        await connectDB();
        let { billId } = JSON.parse(req);
        let bill = await Bill.findById(billId);
        if(!bill){
            return send({ status:status.ERROR, message:"Customer not found"});
        }
        return send({status:status.SUCCESS, data:bill.customerId});
        
    } catch (error) {
        return send({ status:status.INTERNAL_SERVER_ERROR, message: "An error occurred while processing your request" });

    }
    finally{
        await disconnectDB();

    }
}



