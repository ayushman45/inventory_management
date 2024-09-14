"use server"
import { config } from "../config";
import { connect,disconnect } from 'mongoose';
export async function connectDB(){
    // let res = await connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
    // console.log("DB connected successfully");
    
}

export async function disconnectDB(){
    // let res = await disconnect();
    // console.log("DB disconnected successfully");

}

async function connectMongoDB(){
    let res = await connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log("DB connected successfully");
}
connectMongoDB();
