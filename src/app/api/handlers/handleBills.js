"use server";

import { connectDB, disconnectDB } from "../db";
import { Bill } from "../../../backendHelpers/models/bill";
import { Product } from "../../../backendHelpers/models/product";
import { Purchase } from "../../../backendHelpers/models/purchase";
import { Service } from "../../../backendHelpers/models/service";
import { VendorBill } from "../../../backendHelpers/models/vendorBill";
import { VendorPurchase } from "../../../backendHelpers/models/vendorPurchase";
import { send } from "./sendToFrontEnd";
import { status } from "../../../backendHelpers/status";

export async function getBillById(req) {
  try {
    await connectDB();
    let { billId, user, type } = JSON.parse(req);
    let bill =
      type === "customer"
        ? await Bill.findById(billId)
        : await VendorBill.findById(billId);
    if (bill) return send({ status: status.SUCCESS, data: bill });
    else return send({ status: status.NOT_FOUND, message: "Bill not found" });
  } catch (error) {
    console.error(error);
    return send({
      status: status.INTERNAL_SERVER_ERROR,
      message: "An error occurred while processing your request",
    });
  } finally {
    await disconnectDB();
  }
}


export async function deletePurchase(req) {
  try {
    await connectDB();
    let { billId, purchaseId, type } = JSON.parse(req);
    let purchase, bill;
    if (type === "customer") {
      purchase = await Purchase.findByIdAndDelete(purchaseId);
      bill = await Bill.findByIdAndUpdate(billId, {
        $pull: { purchases: purchaseId },
      });
    } else {
      purchase = await VendorPurchase.findByIdAndDelete(purchaseId);
      bill = await VendorBill.findByIdAndUpdate(billId, {
        $pull: { purchases: purchaseId },
      });
    }
    if (purchase && bill) {
      return send({
        status: status.SUCCESS,
        message: "Purchase deleted successfully",
      });
    } else {
      if (!purchase)
        return send({
          status: status.NOT_FOUND,
          message: "Purchase not found",
        });
      else return send({ status: status.NOT_FOUND, message: "Bill not found" });
    }
  } catch (err) {
    console.log(err.message);
    return send({
      status: status.INTERNAL_SERVER_ERROR,
      message: "An error occurred while processing your request",
    });
  } finally {
    await disconnectDB();
  }
}

export const getBillProducts = async (req) => {
    try {
      await connectDB();
      let { purchases, type } = JSON.parse(req);
      let resStr = "";
  
      // Use a for...of loop to handle asynchronous calls in sequence
      for (const purchaseIdObj of purchases) {
        let purchaseId = purchaseIdObj.toString();
        console.log(purchaseId);
  
        let purchase =
          type === "customer"
            ? await Purchase.findById(purchaseId)
            : await VendorPurchase.findById(purchaseId);
  
        console.log(purchase, "checking");
  
        if (purchase) {
          if (purchase.purchaseType) {
            if (purchase.purchaseType === "product") {
              let product = await Product.findById(purchase.productId);
              if (product) {
                resStr += `${product.productName} x ${purchase.quantity}, `;
              }
            } else {
              let service = await Service.findById(purchase.purchaseId);
              if (service) {
                resStr += `${service.serviceName}, `;
              }
            }
          } else {
            let product = await Product.findById(purchase.productId);
            if (product) {
              resStr += `${product.productName} x ${purchase.quantity}, `;
            }
          }
        } 
      }

    if(resStr)
        return send({ status: status.SUCCESS, data: resStr });
    else
        return send({ status: status.NOT_FOUND, message: "No products found" });

    } catch (err) {
      console.error(err);
      return send({
        status: status.INTERNAL_SERVER_ERROR,
        message: "An error occurred while processing your request",
      });
    } finally {
      await disconnectDB();
    }
  };
  
