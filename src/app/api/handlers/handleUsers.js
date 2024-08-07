"use server";

import { encrypt } from '../passwordHandler/bcrypt';
import { User } from '../models/user';
const { send } = require('./sendToFrontEnd');
const { status } = require('./status');

export async function updateOrCreateUser(req){
    const user_data = JSON.parse(req);
    let id = user_data._id;
    if(!id){
        let temp=await User.findOne({username:user_data.username})
        if(temp){
            return send({status:status.FAILED,message:"Username already exists"});
        }
        user_data.password = await encrypt(user_data.password);
        let user = new User(user_data);
        await user.save();
        return send({status:status.SUCCESS,data: user});

    }
    let user = await User.findById(id);
    if(user){
        user = await User.findByIdAndUpdate(id, user_data, {new: true});
        return send({status:status.SUCCESS,data: user});

    }
    else{
        return send({status:status.FAILED,message:"User not found"});

    }
}