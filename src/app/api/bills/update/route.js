"use server";

import { Bill } from "@/backendHelpers/models/bill";
import { connectDB, disconnectDB } from "../../db";
import { response } from "../../handlers/sendToFrontEnd";
import { status } from "@/backendHelpers/status";

export async function GET(req) {
  try {
    await connectDB();
    let params = new URL(req.url);
    let id = params.searchParams.get("id");
    let date = params.searchParams.get("date");

    let bill = await Bill.findById(id);
    if (!bill) {
      return response({ message: "Bill not found" }, status.NOT_FOUND);
    } else {
      let dt = new Date(date);
      bill.date = dt;
      let updatedBill = await bill.save();
      return response({ updatedBill }, status.SUCCESS);
    }
  } catch (err) {
      return response({ message: "Internal Server Error" }, status.INTERNAL_SERVER_ERROR);
  } finally {
      await disconnectDB();
  }
}
