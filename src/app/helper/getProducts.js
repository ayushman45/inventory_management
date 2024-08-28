"use client"

import { getAllProducts } from "../api/handlers/productHandler"
import { getAllServices } from "../api/handlers/serviceHandler";
import { parseString, stringifyObject } from "../jsonHelper"

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