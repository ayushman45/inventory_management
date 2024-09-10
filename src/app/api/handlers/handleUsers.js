"use server";

import { encrypt } from "../../../backendHelpers/passwordHandler/bcrypt";
import { User } from "../../../backendHelpers/models/user";
import { connectDB, disconnectDB } from "../db";
const { send } = require("./sendToFrontEnd");
const { status } = require("../../../backendHelpers/status");

export async function updateOrCreateUser(req) {
  try {
    await connectDB();
    const user_data = JSON.parse(req);
    let id = user_data._id;
    if (!id) {
      let temp = await User.findOne({ username: user_data.username });
      if (temp) {
        return send({
          status: status.FAILED,
          message: "Username already exists",
        });
      }
      user_data.password = await encrypt(user_data.password);
      let user = new User(user_data);
      await user.save();
      return send({ status: status.SUCCESS, data: user });
    }
    let user = await User.findById(id);
    if (user) {
      user = await User.findByIdAndUpdate(id, user_data, { new: true });
      return send({ status: status.SUCCESS, data: user });
    } else {
      return send({ status: status.FAILED, message: "User not found" });
    }
  } catch (err) {
    return send({ status: status.FAILED, message: "User not found" });
  } finally {
    await disconnectDB();
  }
}
