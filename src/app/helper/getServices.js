"use client"

import { getAllServices } from "../api/handlers/serviceHandler"
import { parseString, stringifyObject } from "../jsonHelper"

export const getServicesForUser = async(user)=>{
    let resp = await getAllServices(stringifyObject({user}));
    let res = await parseString(resp);
    return res.data;

}