"use server";

import { connectDB, disconnectDB } from "../db";
import { Student } from "../../../backendHelpers/models/student";
import { send } from "./sendToFrontEnd";
import { status } from "../../../backendHelpers/status";

export async function createOrUpdateStudent(req) {
  try {
    await connectDB();
    const student_data = JSON.parse(req);
    let id = student_data._id;
    if (!id) {
      let temp = new Student(student_data);
      await temp.save();
      console.log(temp);
      return send({ status: status.SUCCESS, data: temp });
    } else {
      let temp = await Student.findByIdAndUpdate(id, student_data, {
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

export async function getAllStudents(req) {
    try {
      await connectDB();
      let {user} = JSON.parse(req);
      if(!user){
        return send({status:status.FORBIDDEN, message:"Unauthorized access"});

      }
      let students = await Student.find({user});
      return send({ status: status.SUCCESS, data: students });
    } catch (err) {
      return send({
        status: status.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    } finally {
      await disconnectDB();
    }
  }

  export async function importStudentsFromCSV(req){
    try{
        await connectDB();
        let {user, data} = JSON.parse(req);
        if(!user){
            return send({status:status.FORBIDDEN, message:"Unauthorized access"});
    
        }
        let students = data.map((student)=>{
            return {...student, user};
        });
        let res = await Student.insertMany(students);
        return send({status:status.SUCCESS, data:res});
    }
    catch(err){
        return send({status:status.INTERNAL_SERVER_ERROR, message:err.message});
    }
    finally{
        await disconnectDB();
    }

  }

  export async function getStudent(req){
    try{
        await connectDB();
        let {user, id} = JSON.parse(req);
        if(!user){
            return send({status:status.FORBIDDEN, message:"No User Sent"});
    
        }
        let student = await Student.findById(id);
        if(!student){
            return send({status:status.NOT_FOUND, message:"Student not found"});
        }
        if(student.user !== user){
            return send({status:status.FORBIDDEN, message:"Unauthorized access"});
        }

        return send({status:status.SUCCESS, data:student});
    }
    catch(err){
        return send({status:status.INTERNAL_SERVER_ERROR, message:err.message});
    }
    finally{
        await disconnectDB();
    }
  }
