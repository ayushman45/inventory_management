"use server";

import { connectDB, disconnectDB } from "../db";
const { Vendor } = require("../models/vendor");
import { send } from "./sendToFrontEnd";
import { status } from "./status";

export async function importVendorsFromCSV(req) {
  try {
    await connectDB();
    let { user, data } = JSON.parse(req);
    if (!user) {
      return send({ status: status.FORBIDDEN, message: "Unauthorized access" });
    }
    let vendors = data.map((vendor) => {
      return { ...vendor, user };
    });
    let res = await Vendor.insertMany(vendors);
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

export async function getVendor(req){
    try{
        await connectDB();
        let {user, id} = JSON.parse(req);
        if(!user){
            return send({status:status.FORBIDDEN, message:"No User Sent"});
    
        }
        let vendor = await Vendor.findById(id);
        if(!vendor){
            return send({status:status.NOT_FOUND, message:"Vendor not found"});
        }
        if(vendor.user !== user){
            return send({status:status.FORBIDDEN, message:"Unauthorized access"});
        }

        return send({status:status.SUCCESS, data:vendor});
    }
    catch(err){
        return send({status:status.INTERNAL_SERVER_ERROR, message:err.message});
    }
    finally{
        await disconnectDB();
    }
  }

  export async function getAllVendors(req) {
    try {
      await connectDB();
      let {user} = JSON.parse(req);
      if(!user){
        return send({status:status.FORBIDDEN, message:"Unauthorized access"});

      }
      let vendors = await Vendor.find({user});
      return send({ status: status.SUCCESS, data: vendors });
    } catch (err) {
      return send({
        status: status.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    } finally {
      await disconnectDB();
    }
  }

  export async function createOrUpdateVendor(req) {
    try {
      await connectDB();
      const vendor_data = JSON.parse(req);
      console.log(vendor_data);
      let id = vendor_data._id;
      if (!id) {
        let temp = new Vendor(vendor_data);
        await temp.save();
        return send({ status: status.SUCCESS, data: temp });
      } else {
        let temp = await Vendor.findByIdAndUpdate(id, vendor_data, {
          new: true,
        });
        return send({ status: status.SUCCESS, data: temp });
      }
    } catch (err) {
      console.log(err.message);
      return send({
        status: status.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    } finally {
      await disconnectDB();
    }
  }
