"use server";

import { connectDB, disconnectDB } from "@/app/api/db";
import { status } from "@/backendHelpers/status";
import { Service } from "@/backendHelpers/models/service";
import { response } from "@/app/api/handlers/sendToFrontEnd";

export async function GET(request, { params }) {
  try {
    await connectDB();

    let { id } = params;
    if (!id) {
      return response({ message: "ID is required" }, status.BAD_REQUEST);
    }

    let deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
      return response({ message: "Service not found" }, status.NOT_FOUND);
    }

    return response(
      { message: "Service deleted successfully" },
      status.SUCCESS
    );
  } catch (err) {
    console.error(err.message);
    return response(
      { message: "Internal Server Error" },
      status.INTERNAL_SERVER_ERROR
    );
  } finally {
    await disconnectDB();
  }
}
