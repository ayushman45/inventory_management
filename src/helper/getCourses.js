"use client"

import { getAllCourses } from "../app/api/handlers/handleCourses"
import { parseString, stringifyObject } from "../app/jsonHelper"

export const getCoursesForUser = async(user)=>{
    let resp = await getAllCourses(stringifyObject({user}));
    let res = await parseString(resp);
    return res.data;

}