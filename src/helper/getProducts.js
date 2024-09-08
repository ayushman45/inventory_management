"use client"

import { getAllProducts } from "../app/api/handlers/handleProducts"
import { getAllServices } from "../app/api/handlers/handleServices";
import { parseString, stringifyObject } from "../app/jsonHelper"

export const getProductsForUser = async(user)=>{
    let resp = await getAllProducts(stringifyObject({user}));
    let res = await parseString(resp);
    return res.data;

}

export const getServicesForUser = async(user)=>{
    let resp = await getAllServices(stringifyObject({user}));
    let res = await parseString(resp);
    return res.data;

}