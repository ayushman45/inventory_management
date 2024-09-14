"use server";

import { connectDB, disconnectDB } from "../../db";
import { VendorBill } from "@/backendHelpers/models/vendorBill";
import { response } from "../../handlers/sendToFrontEnd";
import { message } from "antd";

export async function GET(req) {
  try {
    await connectDB();
    let params = new URL(req.url);
    let id = params.searchParams.get("id");
    let date = params.searchParams.get("date");

    let bill = await VendorBill.findById(id);
    if (!bill) {
      return response({message: "Bill not found"}, 404);
    } else {
      let dt = new Date(date);
      bill.date = dt;
      let updatedBill = await bill.save();
      return response({ updatedBill }, 200);
    }
  } catch (err) {
    console.error(err.message);
    return response({ message: "Internal Server Error" }, 500);
  } finally {
    await disconnectDB();
  }
}
