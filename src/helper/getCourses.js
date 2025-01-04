"use client"

import { getAllBatches, getAllCourses } from "../app/api/handlers/handleCourses"
import { parseString, stringifyObject } from "../app/jsonHelper"

export const getCoursesForUser = async(user)=>{
    let resp = await getAllCourses(stringifyObject({user}));
    console.log(resp);
    let res = await parseString(resp);
    return res.data;

}

export const getBatchesforUser = async(user)=>{
    let resp = await getAllBatches(stringifyObject({user}));
    if(!resp){
        return [];
    }
    let res = await parseString(resp);
    return res.data;
    
}