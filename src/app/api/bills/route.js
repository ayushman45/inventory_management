"use server"

import { Bill } from "@/backendHelpers/models/bill";
import { status } from "../../../backendHelpers/status";
import { connectDB, disconnectDB } from "../db";
import { VendorBill } from "@/backendHelpers/models/vendorBill";
import { response } from "../handlers/sendToFrontEnd";
import { headers } from "next/headers";

export async function GET(req){
    
    try{
        let headersList = headers();
        let id = headersList.get("id");
        let type = headersList.get("type");
        let user = headersList.get("user");
        console.log(id, type, user)
        await connectDB();
        if(!id){
            return response({ message: "ID is required" },status.BAD_REQUEST);
        }
        if(!user){
            return response({ message: "Unauthorized access" },status.UNAUTHORIZED);
        }
        if(type==="customer"){
            let bills = await Bill.find({customerId:id,user});
            return response({ bills },status.SUCCESS);
        }
        else{
            let bills = await VendorBill.find({vendorId:id,user});
            return response({ bills },status.SUCCESS);
        }
    }
    catch(error){
        console.error(error.message);
        return response({ message: "Internal Server Error" },status.INTERNAL_SERVER_ERROR);
    }
    finally{
        await disconnectDB();
    }
}