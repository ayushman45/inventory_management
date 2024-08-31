"iuse client";

import { Button, DatePicker, Form, Input, message } from "antd";
import React, { useRef, useState } from "react";
import { getInvUser, getToken } from "../helper/token";
import { getLocaleDate } from "../helper/date";
import { createOrUpdateVendor } from "../api/handlers/handleVendors";
import { parseString, stringifyObject } from "../jsonHelper";

function NewVendor({ onClose }) {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const stateRef = useRef(null);
  const addressRef = useRef(null);
  const cityRef = useRef(null);
  const pincodeRef = useRef(null);

  const handleSubmit = async(e) => {
    e.preventDefault();
    let name = nameRef.current.input.value;
    let email = emailRef.current.input.value;
    let phone = phoneRef.current.input.value;
    let state = stateRef.current.input.value;
    let pincode = pincodeRef.current.input.value;
    let address = addressRef.current.input.value;
    let city = cityRef.current.input.value;
    let user = await getInvUser().username;
    let resp = await createOrUpdateVendor(stringifyObject({ name, email, phone, state, pincode, address, city, user }));
    let res = parseString(resp);
    if (res.status === 200) {
      message.success("Vendor Created Successfully");
      onClose();
    }
    else {
     message.error("Failed to create vendor");
     onClose();
    }
  };

  return (
    <div>
      <Form>
        <Form.Item label="Vendor Name">
          <Input placeholder="Enter Vendor Name" ref={nameRef} />
        </Form.Item>
        <Form.Item label="Vendor Email" >
          <Input placeholder="Enter Vendor Email" ref={emailRef} />
        </Form.Item>
        <Form.Item label="Vendor Phone">
          <Input placeholder="Enter Vendor Phone" ref={phoneRef} />
        </Form.Item>
        <Form.Item label="Vendor Address">
          <Input placeholder="Enter Vendor Address" ref={addressRef} />
        </Form.Item>
        <Form.Item label="Vendor City">
          <Input placeholder="Enter Vendor City" ref={cityRef} />
        </Form.Item>
        <Form.Item label="Vendor State">
          <Input placeholder="Enter Vendor State" ref={stateRef} />
        </Form.Item>
        <Form.Item label="Vendor Pincode">
          <Input placeholder="Enter Vendor City" ref={pincodeRef} />
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

export default NewVendor;
