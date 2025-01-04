const { connectMongoDB } = require("./app/api/db");

export async function helper(){
    console.log("Connecting to DB");
    await connectMongoDB();

}