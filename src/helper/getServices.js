"use client"

import { getAllServices } from "../app/api/handlers/handleServices"
import { parseString, stringifyObject } from "../app/jsonHelper"

export const getServicesForUser = async(user)=>{
    let resp = await getAllServices(stringifyObject({user}));
    let res = await parseString(resp);
    return res.data;

}