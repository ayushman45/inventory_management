"use server";

import { connectDB, disconnectDB } from "../db";
const { Service } = require("../../../backendHelpers/models/service");
import { send } from "./sendToFrontEnd";
import { status } from "../../../backendHelpers/status";

export async function importServicesFromCSV(req) {
  try {
    await connectDB();
    let { user, data } = JSON.parse(req);
    if (!user) {
      return send({ status: status.FORBIDDEN, message: "Unauthorized access" });
    }
    let services = data.map((service) => {
      return { ...service, user };
    });
    let res = await Service.insertMany(services);
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

export async function getService(req){
    try{
        await connectDB();
        let {user, id} = JSON.parse(req);
        if(!user){
            return send({status:status.FORBIDDEN, message:"No User Sent"});
    
        }
        let service = await Service.findById(id);
        if(!service){
            return send({status:status.NOT_FOUND, message:"Service not found"});
        }
        if(service.user !== user){
            return send({status:status.FORBIDDEN, message:"Unauthorized access"});
        }

        return send({status:status.SUCCESS, data:service});
    }
    catch(err){
        return send({status:status.INTERNAL_SERVER_ERROR, message:err.message});
    }
    finally{
        await disconnectDB();
    }
  }

  export async function getAllServices(req) {
    try {
      await connectDB();
      let {user} = JSON.parse(req);
      if(!user){
        return send({status:status.FORBIDDEN, message:"Unauthorized access"});

      }
      let services = await Service.find({user});
      return send({ status: status.SUCCESS, data: services });
    } catch (err) {
      return send({
        status: status.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    } finally {
      await disconnectDB();
    }
  }

  export async function createOrUpdateService(req) {
    try {
      await connectDB();
      const service_data = JSON.parse(req);
      console.log(service_data);
      let id = service_data._id;
      if (!id) {
        let temp = new Service(service_data);
        await temp.save();
        return send({ status: status.SUCCESS, data: temp });
      } else {
        let temp = await Service.findByIdAndUpdate(id, service_data, {
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
