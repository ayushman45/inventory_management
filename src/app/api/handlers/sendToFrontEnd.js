import { NextResponse } from "next/server";

export async function send(payload){
    return (JSON.stringify(payload));

}

export async function response(payload,status,headers){
    let res = new NextResponse(JSON.stringify(payload),{status})
    return res

}