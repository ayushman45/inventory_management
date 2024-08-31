"iuse client";

import { Button, DatePicker, Form, Input, message } from "antd";
import React, { useRef, useState } from "react";
import { getInvUser, getToken } from "../helper/token";
import { getLocaleDate } from "../helper/date";
import { createOrUpdateProduct } from "../api/handlers/handleProducts";
import { parseString, stringifyObject } from "../jsonHelper";

function NewProduct({ onClose }) {
  const nameRef = useRef(null);
  const companyRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleSubmit = async(e) => {
    e.preventDefault();
    let productName = nameRef.current.input.value;
    let company = companyRef.current.input.value;
    let description = descriptionRef.current.input.value;
    let user = await getInvUser().username;
    let resp = await createOrUpdateProduct(stringifyObject({ productName, company, description,user }));
    let res = parseString(resp);
    if (res.status === 200) {
      message.success("Product Created Successfully");
      onClose();
    }
    else {
     message.error("Failed to create product");
     onClose();
    }
  };

  return (
    <div>
      <Form>
        <Form.Item label="Product Name">
          <Input placeholder="Enter Product Name" ref={nameRef} />
        </Form.Item>
        <Form.Item label="Company" >
          <Input placeholder="Enter Product Email" ref={companyRef} />
        </Form.Item>
        <Form.Item label="Product Description">
          <Input placeholder="Enter Product Phone" ref={descriptionRef} />
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

export default NewProduct;
