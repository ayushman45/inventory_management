"use server"

import { connectDB, disconnectDB } from "../db"
import { Expense } from "../models/expense";
import { Payment } from "../models/payment";
import { VendorDebit } from "../models/vendorDebit";
import { send } from "./sendToFrontEnd";

export async function getAnalytics(req){
    try{
        await connectDB();
        let {startDate,endDate,user} = JSON.parse(req);
        let start = new Date(startDate)
        let end = new Date(endDate);
        
        if(!user){
            return send({status:403, message:"Unauthorized access"});
        }
        let credits = 0;
        let debits = 0;
        let expenses = await Expense.find({user, date:{$gte:new Date(start), $lte:new Date(end)}})
        if(expenses){
            debits += expenses.reduce((acc, curr) => acc + curr.amount, 0);
        }
        let vendorDebits = await VendorDebit.find({user, date:{$gte:new Date(start), $lte:new Date(end)}})
        if(vendorDebits){
            debits += vendorDebits.reduce((acc, curr) => acc + curr.amount, 0);
        }
        let incomes = await Payment.find({user, date:{$gte:new Date(start), $lte:new Date(end)}})
        if(incomes){
            credits += incomes.reduce((acc, curr) => acc + curr.amount, 0);
        }
        return send({status:200, data:{credits,debits,startDate,endDate}});

    }
    catch(err){
        console.error(err);
        return send({status:500, message:"Internal Server Error"});
    }
    finally{
        await disconnectDB();
    }
}