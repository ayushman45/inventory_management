"use client"

import { getAllStudents } from "../app/api/handlers/handleStudents"
import { parseString, stringifyObject } from "../app/jsonHelper"

export const getStudentsForUser = async(user)=>{
    let resp = await getAllStudents(stringifyObject({user}));
    let res = await parseString(resp);
    return res.data;

}