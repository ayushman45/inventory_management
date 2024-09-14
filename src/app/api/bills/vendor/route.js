import { headers } from "next/headers";
import { response } from "../../handlers/sendToFrontEnd"
import { connectDB, disconnectDB } from "../../db";
import { VendorBill } from "@/backendHelpers/models/vendorBill";

export async function GET(req){
    try {
        let headersList = headers();
        let user = headersList.get('user');
        let vendor = headersList.get('vendor');
        await connectDB();
        let bills = await VendorBill.find({ vendorId:vendor, user });
        if (bills && bills.length > 0){
            return response({bills},200)
        }
        else{
            return response({message: "No bills found"},404)
        }
    } catch (error) {
        console.log(error.message)
        return response({message: "An error occurred while processing your request"},500)
    }
    finally{
        await disconnectDB();
    }
}