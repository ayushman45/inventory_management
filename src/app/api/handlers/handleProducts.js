"use server";

import { connectDB, disconnectDB } from "../db";
const { Product } = require("../../../backendHelpers/models/product");
import { send } from "./sendToFrontEnd";
import { status } from "../../../backendHelpers/status";

export async function importProductsFromCSV(req) {
  try {
    await connectDB();
    let { user, data } = JSON.parse(req);
    if (!user) {
      return send({ status: status.FORBIDDEN, message: "Unauthorized access" });
    }
    let products = data.map((product) => {
      return { ...product, user };
    });
    let res = await Product.insertMany(products);
    return send({ status: status.SUCCESS, data: res });
  } catch (err) {
    return send({
      status: status.INTERNAL_SERVER_ERROR,
      message: err.message,
    });
  } finally {
    await disconnectDB();
  }
}

export async function getProduct(req){
    try{
        await connectDB();
        let {user, id} = JSON.parse(req);
        if(!user){
            return send({status:status.FORBIDDEN, message:"No User Sent"});
    
        }
        let product = await Product.findById(id);
        if(!product){
            return send({status:status.NOT_FOUND, message:"Product not found"});
        }
        if(product.user !== user){
            return send({status:status.FORBIDDEN, message:"Unauthorized access"});
        }

        return send({status:status.SUCCESS, data:product});
    }
    catch(err){
        return send({status:status.INTERNAL_SERVER_ERROR, message:err.message});
    }
    finally{
        await disconnectDB();
    }
  }

  export async function getAllProducts(req) {
    try {
      await connectDB();
      let {user} = JSON.parse(req);
      if(!user){
        return send({status:status.FORBIDDEN, message:"Unauthorized access"});

      }
      let products = await Product.find({user});
      return send({ status: status.SUCCESS, data: products });
    } catch (err) {
      return send({
        status: status.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    } finally {
      await disconnectDB();
    }
  }

  export async function createOrUpdateProduct(req) {
    try {
      await connectDB();
      const product_data = JSON.parse(req);
      console.log(product_data);
      let id = product_data._id;
      if (!id) {
        let temp = new Product(product_data);
        await temp.save();
        return send({ status: status.SUCCESS, data: temp });
      } else {
        let temp = await Product.findByIdAndUpdate(id, product_data, {
          new: true,
        });
        return send({ status: status.SUCCESS, data: temp });
      }
    } catch (err) {
      return send({
        status: status.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    } finally {
      await disconnectDB();
    }
  }
