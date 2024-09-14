import { NextResponse } from "next/server"
import { connectDB, disconnectDB } from "../db"
import { status } from "@/backendHelpers/status"
import { message } from "antd"
import { Expense } from "@/backendHelpers/models/expense"
import { VendorDebit } from "@/backendHelpers/models/vendorDebit"
import { Payment } from "@/backendHelpers/models/payment"
import { response } from "../handlers/sendToFrontEnd"

export async function GET(req){
    let url = new URLSearchParams(req.url)
    let startDate = url.get('startDate')
    let endDate = url.get('endDate')
    let user = url.get('user')
    try{
        await connectDB();
        let start = new Date(startDate)
        let end = new Date(endDate);
        
        if(!user){
            return response({message:"Unauthorized access"},status.UNAUTHORIZED);
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
        return response({credits, debits}, status.SUCCESS);
    }
    catch(err){
        console.error(err.message);
        return response({message:"Internal Server Error"}, status.INTERNAL_SERVER_ERROR);
    }
    finally{
        await disconnectDB();
    }
}