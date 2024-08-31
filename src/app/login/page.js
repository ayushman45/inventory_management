"use client";
import React, { useEffect, useRef } from "react";
import { Button, Form, Input, message } from "antd";
import { loginUser } from "../api/handlers/handleUserLogin";
import { parseString, stringifyObject } from "../jsonHelper";
import { useRouter } from "next/navigation";
import { getToken, setInvUser, setToken } from "../helper/token";

function Login() {
  const navigate = useRouter();
  const loginRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLogin = async () => {
    let username = loginRef.current.input.value;
    let password = passwordRef.current.input.value;
    let res = await loginUser(stringifyObject({ username, password }));
    let response = parseString(res);
    if (response.status === 200) {
      message.success("Login Successful");
      setToken(response.data);
      setInvUser(response.data);
      navigate.push("/dashboard");
    } else {
      message.error("Invalid Credentials");
    }
  };

  useEffect(()=>{
    if(getToken()){
        navigate.push("/dashboard");

    }

  },[])
  return (
    <div>
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
