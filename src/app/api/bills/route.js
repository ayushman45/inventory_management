"use server"

import { Bill } from "@/backendHelpers/models/bill";
import { status } from "../../../backendHelpers/status";
import { connectDB, disconnectDB } from "../db";
import { VendorBill } from "@/backendHelpers/models/vendorBill";

export async function GET(req){
    
    try{
        let params = new URL(req.url);
        let id=params.searchParams.get("id");
        let type=params.searchParams.get("type");
        let user=params.searchParams.get("user");
        await connectDB();
        if(!id){
            return new Response(JSON.stringify({ message: "ID is required" }), {
                status: status.BAD_REQUEST,
                headers: { 'Content-Type': 'application/json' },
            })
        }
        if(!user){
            return new Response(JSON.stringify({ message: "User is required" }), {
                status: status.UNAUTHORIZED,
                headers: { 'Content-Type': 'application/json' },
            })
        }
        if(type==="customer"){
            let bills = await Bill.find({customerId:id,user});
            return new Response(JSON.stringify({ status: status.SUCCESS, data: bills }), {
                status: status.OK,
                headers: { 'Content-Type': 'application/json' },
            })
        }
        else{
            let bills = await VendorBill.find({vendorId:id,user});
            return new Response(JSON.stringify({ status: status.SUCCESS, data: bills }), {
                status: status.OK,
                headers: { 'Content-Type': 'application/json' },
            })
        }
    }
    catch(error){
        console.error(error);
        return new Response(JSON.stringify({ status: status.INTERNAL_SERVER_ERROR, message: "An error occurred while processing your request" }), {
            status: status.INTERNAL_SERVER_ERROR,
            headers: { 'Content-Type': 'application/json' },
        })
    }
    finally{
        await disconnectDB();
    }
}