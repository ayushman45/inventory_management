"use client"

import { getAllCustomers } from "../app/api/handlers/handleCustomers"
import { parseString, stringifyObject } from "../app/jsonHelper"

export const getCustomersForUser = async(user)=>{
    let resp = await getAllCustomers(stringifyObject({user}));
    let res = await parseString(resp);
    return res.data;

}