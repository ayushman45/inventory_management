"use server"

import { connectDB, disconnectDB } from "@/app/api/db";
import { status } from "@/backendHelpers/status";
import { Customer } from "@/backendHelpers/models/customer";

export async function GET(request,{params}){
    try{
        await connectDB();

        let {id}=params;
    if(!id){
        return new Response(JSON.stringify({ message: "Customer ID is required" }), {
            status: status.NOT_FOUND,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    let deletedCustomer = await Customer.findByIdAndDelete(id);
    if(!deletedCustomer){
        return new Response(JSON.stringify({ message: "Customer not found" }), {
            status: status.NOT_FOUND,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    
    return new Response(JSON.stringify({ message: "Customer deleted successfully" }), {
        status: status.SUCCESS,
        headers: { 'Content-Type': 'application/json' },
    });
    }

    catch(err){
        return new Response(JSON.stringify({ message: "An error occurred while processing your request" }), {
            status: status.INTERNAL_SERVER_ERROR,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    finally{
        await disconnectDB();
    }
    
 
}