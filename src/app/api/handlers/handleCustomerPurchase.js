"use server";

import { connectDB, disconnectDB } from "../db";
import { Customer } from "../../../backendHelpers/models/customer";
import { Purchase } from "../../../backendHelpers/models/purchase";
import { status } from "../../../backendHelpers/status";
import { Bill } from "../../../backendHelpers/models/bill";
import { send } from "./sendToFrontEnd";
import { Product } from "../../../backendHelpers/models/product";

export async function createBill(req) {
  try {
    await connectDB();
    let { user, purchases, date, customerId,cgst,sgst } = JSON.parse(req);
    if (!user) {
      return send({ status: status.FORBIDDEN, message: "Unauthorized access" });
    }
    let customer = await Customer.findById(customerId);
    if (!customer) {
      return send({ status: status.ERROR, message: "Customer not found" });
    }
    let purchasesArr = [];
    //create new Purchases from purchaes array
    for (let i = 0; i < purchases.length; i++) {
      let temp = new Purchase(purchases[i]);

      if (purchases[i].purchaseType === "product") {
        let product = await Product.findById(purchases[i].productId);
        if (!product) {
          //delete all the already made purchases
          for (let j = 0; j < i; j++) {
            await Purchase.findByIdAndDelete(purchasesArr[j]._id);
          }
          return send({ status: status.ERROR, message: "Product not found" });
        } else {
          product.quantity = (product.quantity || 0) - purchases[i].quantity;
          await product.save();
        }
      }
      if (!temp) {
        //delete all the already made purchases
        for (let j = 0; j < i; j++) {
          await Purchase.findByIdAndDelete(purchasesArr[j]._id);
        }
        return send({ status: status.ERROR, message: "Invalid purchase data" });
      }
      purchasesArr.push(temp._id);
      temp.save();
    }

    let bill = new Bill({
      customerId,
      date,
      purchases: purchasesArr,
      cgst,
      sgst,
      user,
    });

    await bill.save();
    await disconnectDB();
    return send({ status: status.SUCCESS, data: bill });
  } catch (error) {
    console.log(error.message);
    await disconnectDB();
    return send({
      status: status.INTERNAL_SERVER_ERROR,
      message: "An error occurred while processing your request",
    });
  }
}
