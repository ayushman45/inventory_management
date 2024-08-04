"use server"

import { compare } from "../passwordHandler/bcrypt";
import { User } from "../models/user";
import { send } from "./sendToFrontEnd";
import { status } from "./status";

export async function loginUser(req){
    let user_data= JSON.parse(req);
    console.log(user_data)
    let {username,password} = user_data;

    let user = await User.findOne({username})
    if(!user){
        return send({status:status.FAILED,message:"User not found"});
    }
    let check = await compare(password, user.password);
    if(!check){
        return send({status:status.FAILED,message:"Incorrect password"});
    }
    return send({status:status.SUCCESS,message:"Login Successful", data:user});
}