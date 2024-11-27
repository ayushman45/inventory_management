"use server";

import { connectDB, disconnectDB } from "@/app/api/db";
import { status } from "@/backendHelpers/status";
import { Customer } from "@/backendHelpers/models/customer";
import { response } from "@/app/api/handlers/sendToFrontEnd";

export async function GET(request, { params }) {
  try {
    await connectDB();

    let { id } = params;
    if (!id) {
      return response({ message: "ID is required" }, status.BAD_REQUEST);
    }

    let deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) {
      return response({ message: "Customer not found" }, status.NOT_FOUND);
    }

    return response(
      { message: "Customer deleted successfully" },
      status.SUCCESS
    );

  } catch (err) {
    console.error(err.message);
    return response({ message: "Internal Server Error" }, status.INTERNAL_SERVER_ERROR);
  } finally {
    await disconnectDB();
  }
}