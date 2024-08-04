"use client";

import { updateOrCreateUser } from "@/app/api/handlers/handleUsers";
import { parseString, stringifyObject } from "@/app/jsonHelper";
import { Typography, Form, Input, Select, Button } from "antd";
import { useParams } from "next/navigation";
import React, { useRef } from "react";
const { Title } = Typography;

function page() {
  const { slug } = useParams(); // Replace with your name here
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const roleRef = useRef(null);
  const academyEnabledRef = useRef(null);

  const handleAddUser = async() => {
    // TODO: Add validation and save to database
    const username = usernameRef.current.input.value;
    const password = passwordRef.current.input.value;
    const role = roleRef.current.nativeElement.textContent;
    const academyEnabled = academyEnabledRef.current.nativeElement.textContent==="Yes";
    const adminUser = slug;
    let res=await updateOrCreateUser(stringifyObject({ username, password, adminUser, role,academyEnabled }));

  };


  return (
    <div>
      Hello {slug}
      <Title level={2}>Add New User</Title>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input user username!",
            },
          ]}
        >
          <Input ref={usernameRef} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input user password!",
            },
          ]}
        >
          <Input.Password ref={passwordRef} />
        </Form.Item>

        <Form.Item label="Admin Privilages" name="role">
          <Select
            ref={roleRef}
            style={{
              width: 120,
            }}
            defaultValue={"user"}
            options={[
              {
                value: "user",
                label: "user",
              },
              {
                value: "admin",
                label: "admin",
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="Academy Enabled" name="academyEnabled">
          <Select
            ref={academyEnabledRef}
            defaultValue={false}
            style={{
              width: 120,
            }}
            options={[
              {
                value: false,
                label: "No",
              },
              {
                value: true,
                label: "Yes",
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" onClick={handleAddUser}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default page;
