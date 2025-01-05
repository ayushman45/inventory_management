"use server";

import { connectDB, disconnectDB } from "../db";
const { Course } = require("../../../backendHelpers/models/course");
import { send } from "./sendToFrontEnd";
import { status } from "../../../backendHelpers/status";
import { Batch } from "@/backendHelpers/models/batch";

export async function importCoursesFromCSV(req) {
  try {
    await connectDB();
    let { user, data } = JSON.parse(req);
    if (!user) {
      return send({ status: status.FORBIDDEN, message: "Unauthorized access" });
    }
    let courses = data.map((course) => {
      return { ...course, user };
    });
    let res = await Course.insertMany(courses);
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

export async function getCourse(req){
    try{
        await connectDB();
        let {user, id} = JSON.parse(req);
        if(!user){
            return send({status:status.FORBIDDEN, message:"No User Sent"});
    
        }
        let course = await Course.findById(id);
        if(!course){
            return send({status:status.NOT_FOUND, message:"Course not found"});
        }
        if(course.user !== user){
            return send({status:status.FORBIDDEN, message:"Unauthorized access"});
        }

        return send({status:status.SUCCESS, data:course});
    }
    catch(err){
        return send({status:status.INTERNAL_SERVER_ERROR, message:err.message});
    }
    finally{
        await disconnectDB();
    }
  }

  export async function getAllCourses(req) {
    try {
      await connectDB();
      let {user} = JSON.parse(req);
      if(!user){
        return send({status:status.FORBIDDEN, message:"Unauthorized access"});

      }
      let courses = await Course.find({user});
      return send({ status: status.SUCCESS, data: courses });
    } catch (err) {
      return send({
        status: status.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    } finally {
      await disconnectDB();
    }
  }

  export async function getAllBatches(req){
    try{
      console.log(req)
      await connectDB();
      let {user} = JSON.parse(req);
      if(!user){
        return send({status:status.FORBIDDEN, message:"Unauthorized access"});

      }
      let batches = await Batch.find({user});
      console.log(user,batches);
      return send({ status: status.SUCCESS, data: batches });
    } catch (err) {
      return send({
        status: status.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    } finally {
      await disconnectDB();
    }
  }

  export async function createOrUpdateCourse(req) {
    try {
      await connectDB();
      console.log(req)
      const course_data = JSON.parse(req);
      let id = course_data._id;
      if (!id) {
        let temp = new Course(course_data);
        console.log(temp);
        await temp.save();
        return send({ status: status.SUCCESS, data: temp });
      } else {
        let temp = await Course.findByIdAndUpdate(id, course_data, {
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


  export async function createOrUpdateBatch(req) {
    try {
      await connectDB();
      console.log(req)
      const batch_data = JSON.parse(req);
      let id = batch_data._id;
      if (!id) {
        let temp = new Batch(batch_data);
        console.log(temp);
        await temp.save();
        return send({ status: status.SUCCESS, data: temp });
      } else {
        let temp = await Batch.findByIdAndUpdate(id, batch_data, {
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
