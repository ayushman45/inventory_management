"use server"

import { Customer } from "@/backendHelpers/models/customer";
import { connectDB, disconnectDB } from "../db";
import { response } from "../handlers/sendToFrontEnd";
import { headers } from "next/headers";

export async function GET(req){
    try{
        await connectDB();
       let headerList = headers();
        let id = headerList.get("id");
        let user = headerList.get("user");
        if(!user){
            return response({message:"Unauthorized access"}, 401);
    
        }
        let customer = await Customer.findById(id);
        if(!customer){
            return response({message:"Unauthorized access"}, 401);
        }
        if(customer.user !== user){
            return response({message:"Unauthorized access"}, 401);
        }

        return response({customer},200);
    }
    catch(err){
        return response({message:err.message}, 500);
    }
    finally{
        await disconnectDB();
    }
}