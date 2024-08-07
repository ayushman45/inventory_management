"use client"

import { getAllCustomers } from "../api/handlers/customerHandler"
import { parseString, stringifyObject } from "../jsonHelper"

export const getCustomersForUser = async(user)=>{
    let resp = await getAllCustomers(stringifyObject({user}));
    let res = await parseString(resp);
    return res.data;

}