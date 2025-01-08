"use server"

import { Student } from "@/backendHelpers/models/student";

export const addBatchForStudent = async(req) => {
    try{
        let {batchName,studentId} = JSON.parse(req);
        let student = await Student.findOne({_id:studentId});
        let temp = student.batches || [];
        temp.push(batchName);
        if(!student.gender){
            student.gender= "male";
        }

        student.batches = temp;
        await student.save();
        return JSON.stringify({status:200});
    }
    catch(e){
        console.log(e.message)
        return JSON.stringify({status:500});
    }

}