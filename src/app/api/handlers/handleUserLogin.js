"use server";

import { compare } from "../../../backendHelpers/passwordHandler/bcrypt";
import { User } from "../../../backendHelpers/models/user";
import { send } from "./sendToFrontEnd";
import { status } from "../../../backendHelpers/status";
import { connectDB, disconnectDB } from "../db";

export async function loginUser(req) {
  try {
    await connectDB();
    let user_data = JSON.parse(req);
    console.log(user_data);
    let { username, password } = user_data;

    let user = await User.findOne({ username });
    if (!user) {
      return send({ status: status.FAILED, message: "User not found" });
    }
    let check = await compare(password, user.password);
    if (!check) {
      return send({ status: status.FAILED, message: "Incorrect password" });
    }
    return send({
      status: status.SUCCESS,
      message: "Login Successful",
      data: user,
    });
  } catch (err) {
    console.error(err);
    return send({
      status: status.INTERNAL_SERVER_ERROR,
      message: "An error occurred while processing your request",
      error: err,
    });
  } finally {
    await disconnectDB();
  }
}
