"use server"

import { message } from "antd";
import { send } from "./sendToFrontEnd";
import { status } from "./status";
import { connectDB, disconnectDB } from "../db";
import { VendorDebit } from "../models/vendorDebit";
import { Payment } from "../models/payment";

export async function getPaymentsByBillId(req){
    try{
        await connectDB();
        let { billId,type } = JSON.parse(req);
        let payments;
        if(type==='vendor'){
            payments = await VendorDebit.find({ billId }); 
            
        }
        else{
            payments = await Payment.find({ billId });
            
        }

        if(payments && payments.length>0){
            return send({status:status.SUCCESS, data:payments});
        }
        else{
            return send({status:status.NOT_FOUND, message:"No payments found"});
        }
        
    }
    catch(err){
        return send({status:status.INTERNAL_SERVER_ERROR,message:"An internal server error occurred"});
    }
    finally{
        await disconnectDB();
    }
}

export async function createPayment(req){
    try{
        await connectDB();
        console.log(req,"is the request");
        let { payment, type } = JSON.parse(req);
        console.log(payment,type,"is the payment");
        let newPayment;
        if(type==='vendor'){
            newPayment = new VendorDebit(payment);
        }
        else{
            newPayment = new Payment(payment);
        }
        await newPayment.save();
        return send({status:status.SUCCESS, data:newPayment});
    }
    catch(err){
        console.log(err.message);
        return send({status:status.INTERNAL_SERVER_ERROR, message:"An internal server error occurred"});
    }
    finally{
        await disconnectDB();
    }
}