"use server"

import { Batch } from "@/backendHelpers/models/batch";
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

export const getAllBatches = async(req) => {
    try{
        let {user} = JSON.parse(req);
        let batches = await Batch.find({user});
        return JSON.stringify({status:200,batches});
    }
    catch(e){
        console.log(e.message)
        return JSON.stringify({status:500});
    }
}

export const deleteBatch = async (req) => {
    try{
        let {id} = JSON.parse(req);
        await Batch.deleteOne({_id:id});
        return JSON.stringify({status:200});

    }
    catch(e){
        console.log(e.message);
        return JSON.stringify({status:500});

    }
}

export const changeBatchStatus = async (req) => {
    try{
        let {id} = JSON.parse(req);
        let batch = await Batch.findOne({_id:id});
        batch.active = !batch.active;
        await batch.save();
        return JSON.stringify({status:200});

    }
    catch(e){
        console.log(e.message);
        return JSON.stringify({status:500});

    }
}