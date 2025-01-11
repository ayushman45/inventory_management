"use server"

import { VendorBill } from "@/backendHelpers/models/vendorBill";

export async function handleVendorInvoiceChange(req){
    try{
        let {invoice,id} = JSON.parse(req);
        console.log(invoice,id)
        let vendorBill = await VendorBill.findById(id);
        console.log(vendorBill);
        vendorBill.invoice = invoice;
        await vendorBill.save();
        return JSON.stringify({status:200});
    }
    catch(err){
        return JSON.stringify({status:500});
    }
}