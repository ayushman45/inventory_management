"use server"

import { connectDB, disconnectDB } from "@/app/api/db";
import { status } from "@/backendHelpers/status";
import { Service } from "@/backendHelpers/models/service";

export async function GET(request,{params}){
    try{
        await connectDB();

        let {id}=params;
    if(!id){
        return new Response(JSON.stringify({ message: "Service ID is required" }), {
            status: status.NOT_FOUND,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    let deletedService = await Service.findByIdAndDelete(id);
    if(!deletedService){
        return new Response(JSON.stringify({ message: "Service not found" }), {
            status: status.NOT_FOUND,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    
    return new Response(JSON.stringify({ message: "Service deleted successfully" }), {
        status: status.OK,
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