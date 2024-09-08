"use server"

import { connectDB, disconnectDB } from "../db";
import { status } from "../handlers/status";
import { Vendor } from "../models/vendor";

export async function GET(req){
    try{
        await connectDB();
        let {searchParams} = new URL(req.url);
        let vendorId = searchParams.get('vendorId')
        if(!vendorId){
            return new Response(JSON.stringify({ message: "Vendor ID is required" }), {
                status: status.NOT_FOUND,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        let deletedVendor = await Vendor.findByIdAndDelete(vendorId);
        if(!deletedVendor){
            return new Response(JSON.stringify({ message: "Vendor not found" }), {
                status: status.NOT_FOUND,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({ message: "Vendor deleted successfully" }), {
            status: status.SUCCESS,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    catch(err){
        return new Response(JSON.stringify({ message: err.message }), {
            status: status.INTERNAL_SERVER_ERROR,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    finally{
        await disconnectDB();
    }
}