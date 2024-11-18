"iuse client";

import { Button, DatePicker, Form, Input, message } from "antd";
import React, { useRef, useState } from "react";
import { getInvUser, getToken } from "../../helper/token";
import { getLocaleDate } from "../../helper/date";
import { createOrUpdateStudent } from "../api/handlers/handleStudents";
import { parseString, stringifyObject } from "../jsonHelper";

function NewStudent({ onClose }) {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const [dobStr,setDobStr] = useState(null);
  const addressRef = useRef(null);
  const cityRef = useRef(null);
  const fathersRef = useRef(null);
  const guardiansRef = useRef(null);
  const docRef = useRef(null);
  const docIdRef = useRef(null);
  const registrationRef = useRef(null);

  const handleSubmit = async(e) => {
    e.preventDefault();
    let name = nameRef.current.input.value;
    let email = emailRef.current.input.value;
    let phone = phoneRef.current.input.value;
    let dob = getLocaleDate(dobStr);
    let address = addressRef.current.input.value;
    let city = cityRef.current.input.value;
    let fathersName = fathersRef.current.input.value;
    let mothersOrGuardianName = guardiansRef.current.input.value;
    let doc = docRef.current.input.value;
    let docId = docIdRef.current.input.value;
    let registrationNumber = registrationRef.current.input.value;
    let user = await getInvUser().username;
    let resp = await createOrUpdateStudent(stringifyObject({ name, email, phone, dob, address, city, user }));
    let res = parseString(resp);
    if (res.status === 200) {
      message.success("Student Created Successfully");
      onClose();
    }
    else {
     message.error("Failed to create student");
     onClose();
    }
  };

  return (
    <div>
      <Form>
        <Form.Item label="Student Name">
          <Input placeholder="Enter Student Name" ref={nameRef} />
        </Form.Item>
        <Form.Item label="Student Email" >
          <Input placeholder="Enter Student Email" ref={emailRef} />
        </Form.Item>
        <Form.Item label="Student Phone">
          <Input placeholder="Enter Student Phone" ref={phoneRef} />
        </Form.Item>
        <Form.Item label="Registration Number">
          <Input placeholder="Enter Registration Number" ref={registrationRef} />
        </Form.Item>
        <Form.Item label="Student DOB">
          <DatePicker onChange={(date,dateString)=>{setDobStr(dateString)}} />
        </Form.Item>
        <Form.Item label="Student Address">
          <Input placeholder="Enter Student Address" ref={addressRef} />
        </Form.Item>
        <Form.Item label="Student City">
          <Input placeholder="Enter Student City" ref={cityRef} />
        </Form.Item>
        <Form.Item label="Fathers Name">
          <Input placeholder="Enter Fathers Name" ref={fathersRef} />
        </Form.Item>
        <Form.Item label="Mothers / Guardians Name">
          <Input placeholder="Enter Mothers / Guardians Name" ref={guardiansRef} />
        </Form.Item>
        <Form.Item label="Document">
          <Input placeholder="Enter Document Name" ref={docRef} />
        </Form.Item>
        <Form.Item label="Document ID Number">
          <Input placeholder="Enter Document ID Number" ref={docIdRef} />
        </Form.Item>
        <Form.Item style={{display:"flex",flexDirection:"row", gap:"10px"}}>
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default NewStudent;
