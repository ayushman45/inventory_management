"use server";

import { connectDB, disconnectDB } from "../db";
import { Bill } from "../models/bill";
import { Product } from "../models/product";
import { Purchase } from "../models/purchase";
import { Service } from "../models/service";
import { VendorBill } from "../models/vendorBill";
import { VendorPurchase } from "../models/vendorPurchase";
import { send } from "./sendToFrontEnd";
import { status } from "./status";

export async function getBillsForCustomer(req) {
  try {
    await connectDB();
    let { customerId, user } = JSON.parse(req);
    let bills = await Bill.find({ customerId, user });
    if (bills && bills.length > 0)
      return send({ status: status.SUCCESS, data: bills });
    else return send({ status: status.NOT_FOUND, message: "No bills found" });
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

export async function getBillsForVendor(req) {
  try {
    await connectDB();
    let { vendorId, user } = JSON.parse(req);
    let bills = await VendorBill.find({ vendorId, user });
    if (bills && bills.length > 0)
      return send({ status: status.SUCCESS, data: bills });
    else return send({ status: status.NOT_FOUND, message: "No bills found" });
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

export async function updatePurchase(req) {
  try {
    await connectDB();
    let { purchase, type } = JSON.parse(req);
    if (type === "vendor") {
      let purchaseObj = await VendorPurchase.findById(purchase._id);
      let product = await Product.findById(purchase.productId);
      if (purchaseObj && product) {
        console.log(product, purchaseObj);
        product.quantity =
          parseInt(product.quantity) - parseInt(purchaseObj.quantity);
        product.quantity =
          parseInt(product.quantity) + parseInt(purchase.quantity);
        await product.save();
        purchaseObj.quantity = parseInt(purchase.quantity);
        purchaseObj.amount = parseInt(purchase.amount);
        await purchaseObj.save();
        return send({ status: status.SUCCESS, message: "Edit Successful" });
      } else {
        return send({
          status: status.NOT_FOUND,
          message: "Product or Purchase Not Found",
        });
      }
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
  
