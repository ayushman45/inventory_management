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

const MONGODB_URI = config.db;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local',
    )
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function connectMongoDB() {
    if (cached.conn) {
        return cached.conn
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
            console.log('Db connected')
            return mongoose
        })
    }
    try {
        cached.conn = await cached.promise
    } catch (e) {
        cached.promise = null
        throw e
    }

    return cached.conn
}

export default connectMongoDB
