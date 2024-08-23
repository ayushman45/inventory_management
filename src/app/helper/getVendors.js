"use client"

import { getAllVendors } from "../api/handlers/vendorHandler"
import { parseString, stringifyObject } from "../jsonHelper"

export const getVendorsForUser = async(user)=>{
    let resp = await getAllVendors(stringifyObject({user}));
    let res = await parseString(resp);
    return res.data;

}