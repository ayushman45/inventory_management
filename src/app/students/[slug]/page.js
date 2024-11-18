"use client";
import {
  createOrUpdateStudent,
} from "@/app/api/handlers/handleStudents";
import { getUser } from "@/helper/token";
import { parseString, stringifyObject } from "@/app/jsonHelper";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, message, Tabs, Typography } from "antd";
import { getLocaleDate } from "@/helper/date";
import AddStudentPurchase from "../AddStudentPurchase";
import ViewBills from "../ViewBills";
import Header from "@/Components/Header";
import axios from "axios";

const { Title, Paragraph, Text } = Typography;

function EditStudent({ student, getStudentForUser }) {
  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [dob, setDob] = useState(student.dob);
  const [phone, setPhone] = useState(student.phone);
  const [address, setAddress] = useState(student.address);
  const [docId,setDocId]=useState(student.docId);
  const [doc,setDoc]=useState(student.doc);
  const [guardian,setGuardian] = useState(student.mothersOrGuardianName);
  const [father,setFather] = useState(student.fathersName);
  const [registrationNumber,setRegistrationNumber] = useState(student.registrationNumber);
  const [gender,setGender] = useState(student.gender);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedStudent = {
      ...student,
      _id: student._id,
      name,
      email,
      gender,
      dob,
      phone,
      address,
      doc,
      docId,
      mothersOrGuardianName:guardian,
      fathersName:father,
      registrationNumber
    };

    let res = await createOrUpdateStudent(
      stringifyObject({ ...updatedStudent })
    );
    if (parseString(res).status === 200) {
      getStudentForUser();
      message.success("Student Updated Successfully");
    } else {
      message.error("Failed to update student");
    }
  };

  return (
    <div className="form">
      <Header />
      <br />
      <form onSubmit={handleSubmit}>
        <label>Student Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
         <label>Registration Number</label>
        <input
          type="text"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
        />
        <label>Gender</label>
        <input
          type="text"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />
        <label>Student Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Student DOB</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <label>Student Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <label>Student Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <label>Fathers Name</label>
        <input
          type="text"
          value={father}
          onChange={(e) => setFather(e.target.value)}
        />
        <label>Mothers / Guardians Name</label>
        <input
          type="text"
          value={guardian}
          onChange={(e) => setGuardian(e.target.value)}
        />
        <label>Document Name</label>
        <input
          type="text"
          value={doc}
          onChange={(e) => setDoc(e.target.value)}
        />
        <label>Document ID</label>
        <input
          type="text"
          value={docId}
          onChange={(e) => setDocId(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

function Student() {
  const { slug } = useParams();
  const [user,setUser] = useState(null);
  const navigate = useRouter();
  useEffect(() => {
    setUser(getUser());

  }, []);

  const [student, setStudent] = useState(null);
  const [tabItems, setTabItems] = useState(null);

  const getStudentForUser = async () => {
    let res = await axios.get('/api/students',{
      headers:{
        user, id: slug
      }
    })
    if (res.status === 200) {
      let data = res.data;
      setStudent(data.student);
    }
  };

  const handleDeleteStudent = async () => {
    let res = await axios.get(`/api/students/delete/${slug}`);
    if(res.status === 200){
      message.success("Student Deleted Successfully");
      navigate.push("/students");
    }
  
  }

  const onChange = (key) => {
    console.log(key);
  };

  useEffect(() => {
    if (!student) {
      return;
    }

    let jsx = (
      <div>
        <Title>{student.name}</Title>
        <Paragraph>
          <Text strong>Email:</Text> {student.email}
        </Paragraph>
        <Paragraph>
          <Text strong>Phone:</Text> {student.phone}
        </Paragraph>
        <Paragraph>
          <Text strong>DOB (DD/MM/YYYY) :</Text> {getLocaleDate(student.dob)}
        </Paragraph>
        <Paragraph>
          <Text strong>Address:</Text> {student.address}
        </Paragraph>
        <Paragraph>
          <Text strong>City:</Text> {student.city}
        </Paragraph>
      </div>
    );

    const items = [
      {
        key: "1",
        label: "Student Data",
        children: jsx,
      },
      {
        key: "2",
        label: "Edit",
        children: (
          <EditStudent
            student={student}
            getStudentForUser={getStudentForUser}
          />
        ),
      },
      {
        key: "3",
        label: "Delete",
        children: <div>
          <Button type="primary" danger onClick={handleDeleteStudent}>Delete Student</Button>
        </div>,
      },
      {
        key: "4",
        label: "Add Bills",
        children: <AddStudentPurchase />,
      },
      {
        key: "5",
        label: "View Bills",
        children: <ViewBills />,
      }
    ];

    setTabItems(items);

  }, [student]);

  useEffect(() => {
    if (!slug || !user) {
      return;
    }

    getStudentForUser();
  }, [slug, user]);

  if (!student) {
    return <div>Loading ...</div>;
  }
  return (
    <div>
      <Tabs defaultActiveKey="1" items={tabItems} onChange={onChange} />
      <br />
    </div>
  );
}

export default Student;
