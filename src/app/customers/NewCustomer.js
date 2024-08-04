"iuse client";

import { Button, DatePicker, Form, Input } from "antd";
import React, { useRef, useState } from "react";
import { getInvUser, getToken } from "../helper/token";
import { getLocaleDate } from "../helper/date";

function NewCustomer({ onClose }) {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const [dobStr,setDobStr] = useState(null);
  const addressRef = useRef(null);
  const cityRef = useRef(null);

  const handleSubmit = async(e) => {
    e.preventDefault();
    let name = nameRef.current.input.value;
    let email = emailRef.current.input.value;
    let phone = phoneRef.current.input.value;
    let dob = getLocaleDate(dobStr);
    let address = addressRef.current.input.value;
    let city = cityRef.current.input.value;
    let user = await getInvUser().username;
    console.log(name, email, phone, dob, address, city, user);
  };

  return (
    <div>
      <Form>
        <Form.Item label="Customer Name">
          <Input placeholder="Enter Customer Name" ref={nameRef} />
        </Form.Item>
        <Form.Item label="Customer Email" >
          <Input placeholder="Enter Customer Email" ref={emailRef} />
        </Form.Item>
        <Form.Item label="Customer Phone">
          <Input placeholder="Enter Customer Phone" ref={phoneRef} />
        </Form.Item>
        <Form.Item label="Customer DOB">
          <DatePicker onChange={(date,dateString)=>{setDobStr(dateString)}} />
        </Form.Item>
        <Form.Item label="Customer Address">
          <Input placeholder="Enter Customer Address" ref={addressRef} />
        </Form.Item>
        <Form.Item label="Customer City">
          <Input placeholder="Enter Customer City" ref={cityRef} />
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

export default NewCustomer;
