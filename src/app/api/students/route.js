"use server"

import { Student } from "@/backendHelpers/models/student";
import { connectDB, disconnectDB } from "../db";
import { response } from "../handlers/sendToFrontEnd";
import { headers } from "next/headers";

export async function GET(req){
    try{
        await connectDB();
       let headerList = headers();
        let id = headerList.get("id");
        let user = headerList.get("user");
        if(!user){
            return response({message:"Unauthorized access"}, 401);
    
        }
        let student = await Student.findById(id);
        if(!student){
            return response({message:"Unauthorized access"}, 401);
        }
        if(student.user !== user){
            return response({message:"Unauthorized access"}, 401);
        }

        return response({student},200);
    }
    catch(err){
        return response({message:err.message}, 500);
    }
    finally{
        await disconnectDB();
    }
}