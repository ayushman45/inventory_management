"use server"

import { status } from "@/backendHelpers/status";
import { send } from "./sendToFrontEnd";
import { Fees } from "@/backendHelpers/models/fees";
import { message } from "antd";

export async function getFeesForUser(req){
    try{
        let {id} = JSON.parse(req);
        let fees = await Fees.find({studentId:id});
        return send({
            status: status.SUCCESS,
            fees,
            message: "An error occurred while processing your request",
          });

    }
    catch(e){
        console.log(e.message)
        return send({
                status: status.INTERNAL_SERVER_ERROR,
                message: "An error occurred while processing your request",
              });
    }
}

export async function addFees(req){
    try{
        let obj = JSON.parse(req);
        let fee = new Fees({...obj});
        await fee.save();
        return send({
            status: status.SUCCESS
        })
    }
    catch(e){
        console.log(e.message);
        return send({
            status: status.INTERNAL_SERVER_ERROR,
            message: 'An error occured'
        })
    }
}

export async function deleteFees(req){
    try{
        let {id} = JSON.parse(req);
        await Fees.deleteOne({_id:id})
        return send({
            status: status.SUCCESS
        })
    }
    catch(e){
        console.log(e.message);
        return send({
            status: status.INTERNAL_SERVER_ERROR,
            message: 'An error occured'
        })
    }
}