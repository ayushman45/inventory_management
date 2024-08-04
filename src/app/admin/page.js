"use client";
import React, { useRef } from "react";
import { Button, Form, Input } from "antd";
import { Typography } from "antd";
import { useRouter } from "next/navigation";
const { Title } = Typography;

function Login() {
  const navigate = useRouter();
  const loginRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLogin = () => {
    let username = loginRef.current.input.value;
    let password = passwordRef.current.input.value;
    //DWST CHANGE THIS TO API CALL
    if (username === "demo" && password === "password") {
      //Redirect to dashboard
      navigate.push(`/admin/${username}`);
    } else {
      alert("Invalid admin username or password");
    }
  };
  return (
    <div>
      <Title level={2}>Admin Login</Title>
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
              message: "Please input your username!",
            },
          ]}
        >
          <Input ref={loginRef} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password ref={passwordRef} />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" onClick={handleLogin}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
