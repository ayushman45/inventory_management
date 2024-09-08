"iuse client";

import { Button, DatePicker, Form, Input, message } from "antd";
import React, { useRef, useState } from "react";
import { getInvUser, getToken } from "../../helper/token";
import { getLocaleDate } from "../../helper/date";
import { createOrUpdateService } from "../api/handlers/handleServices";
import { parseString, stringifyObject } from "../jsonHelper";

function NewService({ onClose }) {
  const nameRef = useRef(null);
  const typeRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleSubmit = async(e) => {
    e.preventDefault();
    let serviceName = nameRef.current.input.value;
    let type = typeRef.current.input.value;
    let description = descriptionRef.current.input.value;
    let user = await getInvUser().username;
    let resp = await createOrUpdateService(stringifyObject({ serviceName, type, description,user }));
    let res = parseString(resp);
    if (res.status === 200) {
      message.success("Service Created Successfully");
      onClose();
    }
    else {
     message.error("Failed to create service");
     onClose();
    }
  };

  return (
    <div>
      <Form>
        <Form.Item label="Service Name">
          <Input placeholder="Enter Service Name" ref={nameRef} />
        </Form.Item>
        <Form.Item label="Type" >
          <Input placeholder="Enter Service Email" ref={typeRef} />
        </Form.Item>
        <Form.Item label="Service Description">
          <Input placeholder="Enter Service Phone" ref={descriptionRef} />
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

export default NewService;
