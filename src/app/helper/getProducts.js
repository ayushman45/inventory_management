"use client"

import { getAllProducts } from "../api/handlers/productHandler"
import { parseString, stringifyObject } from "../jsonHelper"

export const getProductsForUser = async(user)=>{
    let resp = await getAllProducts(stringifyObject({user}));
    let res = await parseString(resp);
    return res.data;

}