"iuse client";

import { Button, DatePicker, Form, Input, message } from "antd";
import React, { useRef, useState } from "react";
import { getInvUser, getToken } from "../../helper/token";
import { getLocaleDate } from "../../helper/date";
import { createOrUpdateCourse } from "../api/handlers/handleCourses";
import { parseString, stringifyObject } from "../jsonHelper";

function NewCourse({ onClose }) {
  const nameRef = useRef(null);
  const typeRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleSubmit = async(e) => {
    e.preventDefault();
    let courseName = nameRef.current.input.value;
    let description = descriptionRef.current.input.value;
    let user = await getInvUser().username;
    let resp = await createOrUpdateCourse(stringifyObject({ courseName, description,user }));
    let res = parseString(resp);
    if (res.status === 200) {
      message.success("Course Created Successfully");
      onClose();
    }
    else {
     message.error("Failed to create course");
     onClose();
    }
  };

  return (
    <div>
      <Form>
        <Form.Item label="Course Name">
          <Input placeholder="Enter Course Name" ref={nameRef} />
        </Form.Item>
        <Form.Item label="Course Description">
          <Input placeholder="Enter Course Phone" ref={descriptionRef} />
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

export default NewCourse;
