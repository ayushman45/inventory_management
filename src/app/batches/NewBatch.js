"iuse client";

import { Button, DatePicker, Form, Input, message, Select } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { getInvUser, getUser } from "../../helper/token";
import { createOrUpdateBatch } from "../api/handlers/handleCourses";
import { parseString, stringifyObject } from "../jsonHelper";
import { getCoursesForUser } from "@/helper/getCourses";

function NewBatch({ onClose,courses }) {
  const nameRef = useRef(null);
  const [date,setDate] = useState(null);
  const [course,setCourse] = useState(courses.length>0?courses[0].courseName:"");
  const [user,setUser] = useState(null);

  useEffect(()=>{
    let user = getUser();
    setUser(user);

  },[])  

  const handleSubmit = async(e) => {
    e.preventDefault();
    let batchName = nameRef.current.input.value;
    
    let user = await getInvUser().username;
    let resp = await createOrUpdateBatch(stringifyObject({ batchName,date,courseName:course,user }));
    let res = parseString(resp);
    if (res.status === 200) {
      message.success("Batch Created Successfully");
      onClose();
    }
    else {
     message.error("Failed to create batch");
     onClose();
    }
  };

  if(courses.length === 0){
    return (
        <div>Please Add Some Courses First</div>
    )
  }

  return (
    <div>
      <Form>
        <Form.Item label="Batch Name">
          <Input placeholder="Enter Batch Name" ref={nameRef} />
        </Form.Item>
        <Form.Item label="Batch Start Date">
        <DatePicker
          onChange={(e, date) => {
            setDate(date);
          }}
        />
        </Form.Item>
        <Form.Item label="Course Name">
        <Select
          style={{ width: "200px" }}
          placeholder="Select Course"
          onChange={(value) => setCourse(value)}
        >
            {
                courses.length>0 && courses.map(crse=>{
                    return(
                    <Select.Option value={crse.courseName}>{crse.courseName}</Select.Option>
                    )
                })
            }
        </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default NewBatch;