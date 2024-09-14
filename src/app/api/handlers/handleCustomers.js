"use server";

import { connectDB, disconnectDB } from "../db";
import { Customer } from "../../../backendHelpers/models/customer";
import { send } from "./sendToFrontEnd";
import { status } from "../../../backendHelpers/status";

export async function createOrUpdateCustomer(req) {
  try {
    await connectDB();
    const customer_data = JSON.parse(req);
    let id = customer_data._id;
    if (!id) {
      let temp = new Customer(customer_data);
      await temp.save();
      return send({ status: status.SUCCESS, data: temp });
    } else {
      let temp = await Customer.findByIdAndUpdate(id, customer_data, {
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

export async function getAllCustomers(req) {
    try {
      await connectDB();
      let {user} = JSON.parse(req);
      if(!user){
        return send({status:status.FORBIDDEN, message:"Unauthorized access"});

      }
      let customers = await Customer.find({user});
      return send({ status: status.SUCCESS, data: customers });
    } catch (err) {
      return send({
        status: status.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    } finally {
      await disconnectDB();
    }
  }

  export async function importCustomersFromCSV(req){
    try{
        await connectDB();
        let {user, data} = JSON.parse(req);
        if(!user){
            return send({status:status.FORBIDDEN, message:"Unauthorized access"});
    
        }
        let customers = data.map((customer)=>{
            return {...customer, user};
        });
        let res = await Customer.insertMany(customers);
        return send({status:status.SUCCESS, data:res});
    }
    catch(err){
        return send({status:status.INTERNAL_SERVER_ERROR, message:err.message});
    }
    finally{
        await disconnectDB();
    }

  }

  export async function getCustomer(req){
    try{
        await connectDB();
        let {user, id} = JSON.parse(req);
        if(!user){
            return send({status:status.FORBIDDEN, message:"No User Sent"});
    
        }
        let customer = await Customer.findById(id);
        if(!customer){
            return send({status:status.NOT_FOUND, message:"Customer not found"});
        }
        if(customer.user !== user){
            return send({status:status.FORBIDDEN, message:"Unauthorized access"});
        }

        return send({status:status.SUCCESS, data:customer});
    }
    catch(err){
        return send({status:status.INTERNAL_SERVER_ERROR, message:err.message});
    }
    finally{
        await disconnectDB();
    }
  }
