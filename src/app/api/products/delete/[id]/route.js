"use server"

import { connectDB, disconnectDB } from "@/app/api/db";
import { status } from "@/backendHelpers/status";
import { Product } from "@/backendHelpers/models/product";

export async function GET(request,{params}){
    try{
        await connectDB();

        let {id}=params;
    if(!id){
        return new Response(JSON.stringify({ message: "Product ID is required" }), {
            status: status.NOT_FOUND,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    let deletedProduct = await Product.findByIdAndDelete(id);
    if(!deletedProduct){
        return new Response(JSON.stringify({ message: "Product not found" }), {
            status: status.NOT_FOUND,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    
    return new Response(JSON.stringify({ message: "Product deleted successfully" }), {
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