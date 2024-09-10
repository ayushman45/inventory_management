"use server";

import { Bill } from "@/backendHelpers/models/bill";
import { connectDB, disconnectDB } from "../../db";

export async function GET(req) {
  try {
    await connectDB();
    let params = new URL(req.url);
    let id = params.searchParams.get("id");
    let date = params.searchParams.get("date");

    let bill = await Bill.findById(id);
    if (!bill) {
      return new Response(JSON.stringify({ message: "Bill not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      let dt = new Date(date);
      bill.date = dt;
      let updatedBill = await bill.save();
      return new Response(JSON.stringify({ message: "Bill Updated", updatedBill }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await disconnectDB();
  }
}
