"use client"

import { getAllVendors } from "../app/api/handlers/handleVendors"
import { parseString, stringifyObject } from "../app/jsonHelper"

export const getVendorsForUser = async(user)=>{
    let resp = await getAllVendors(stringifyObject({user}));
    let res = await parseString(resp);
    return res.data;

}