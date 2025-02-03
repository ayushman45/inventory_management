"use client";
import { createOrUpdateStudent } from "@/app/api/handlers/handleStudents";
import { getInvUser, getUser } from "@/helper/token";
import { parseString, stringifyObject } from "@/app/jsonHelper";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Tabs,
  Typography,
} from "antd";
import { getLocaleDate } from "@/helper/date";
import AddStudentPurchase from "../AddStudentPurchase";
import ViewBills from "../ViewBills";
import Header from "@/Components/Header";
import axios from "axios";
import { getBatchesforUser } from "@/helper/getCourses";

import "./style.css";
import { addBatchForStudent, deleteBatchForStudent, getAllBatches } from "@/app/api/handlers/handleAddBatches";
import { Fees } from "@/backendHelpers/models/fees";
import { addFees, deleteFees, getFeesForUser } from "@/app/api/handlers/handleFees";
import dayjs from "dayjs";

const { Title, Paragraph, Text } = Typography;

function FeesObject() {
  const [fees, setFees] = useState([]);
  const [batches, setBatches] = useState([]);

  const [batch, setBatch] = useState(null);
  const [amount, setAmount] = useState(0);
  const [paymentType, setPaymentType] = useState("upi");
  const [date, setDate] = useState(dayjs(new Date(Date.now())));
  const [feesObject,setFeesObject] = useState({});
  const [allBatches,setAllBatches] = useState([]);

  const { slug } = useParams();

  const handleGetBatch = async () => {
    let student = await axios.get("/api/students", {
      headers: {
        user: getUser(),
        id: slug,
      },
    });
    let temp = student.data.student.batches;
    let auxFeesHelper = {}
    if(temp.length>0){
      temp.map(t=>{
        auxFeesHelper[t]=[0,0]
      })
    }
    setFeesObject(auxFeesHelper);

    if (temp.length > 0) {
      setBatches(temp);
    }
  };

  const handleGetFees = async () => {
    let res = await getFeesForUser(stringifyObject({ id: slug }));
    if (JSON.parse(res).status === 200) {
      
      let feesTemp = JSON.parse(res).fees;
      setFees(feesTemp);
      let auxHelper = feesObject;
      if(feesTemp.length > 0){
        feesTemp.map(fee=>{
          auxHelper[fee.batch][1]=parseInt(auxHelper[fee.batch][1])+fee.amount;
        })
        
      }
      setFeesObject(auxHelper);
    }
  };

  const handleSubmit = async () => {
    if (!batch) {
      message.warning("No batch selected to add fees");
      return;
    }
    let req = JSON.stringify({
      studentId: slug,
      batch,
      date: new Date(date),
      paymentType,
      amount,
      user: getUser(),
    });
    let res = await addFees(req);
    if (JSON.parse(res).status === 200) {
      globalThis?.window?.location.reload();
    }
  };

  const handleDeleteFees = async(id) => {
    let res = await deleteFees(JSON.stringify({id}));
    if(JSON.parse(res).status === 200){
      globalThis?.window?.location.reload();

    }

  }

  const getAllBatchesForUser = async() => {
    let res = await getAllBatches(JSON.stringify({user:getUser()}));
    res = JSON.parse(res);
    if(res.status === 200){
      setAllBatches(res.batches);
      let auxFeesHelper = feesObject;
      console.log(auxFeesHelper)
      res.batches.map(b=>{
          if(auxFeesHelper[b.batchName]){
            auxFeesHelper[b.batchName][0] = b.fees;
          }
      })
      console.log(auxFeesHelper);
      setFeesObject(auxFeesHelper);
    }
  }

  useEffect(() => {
    handleGetBatch();
    
  }, []);

  useEffect(()=>{
    if(batches.length>0){
      handleGetFees();
    }
  },[batches])

  useEffect(()=>{
    if(batches.length>0){
      getAllBatchesForUser();
    }

  },[batches])

  return (
    <div>
      <Form>
        <Form.Item label="Fees">
          <Input
            placeholder="Enter Total Fees Paid"
            style={{ width: "200px" }}
            type="Number"
            onChange={(e) => setAmount(e.currentTarget.value)}
          />
        </Form.Item>
        <Form.Item label="Batch">
          <Select onChange={(g) => setBatch(g)} style={{ width: "200px" }}>
            {batches.length > 0 &&
              batches.map((bat, index) => {
                return (
                  <Option key={index + "z"} value={bat}>
                    {bat}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item label="Payment Type">
          <Select
            onChange={(g) => setPaymentType(g)}
            style={{ width: "200px" }}
          >
            <Option value="upi">UPI</Option>
            <Option value="cash">CASH</Option>
            <Option value="credit-card">Credit Card</Option>
            <Option value="debit-card">Debit Card</Option>
            <Option value="bank-transfer">Bank Transfer</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Date of Payment">
          <DatePicker value={date} onChange={(e) => setDate(dayjs(new Date(e.endOf('day'))))} />
        </Form.Item>
        <Form.Item
          style={{ display: "flex", flexDirection: "row", gap: "10px" }}
        >
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Form.Item>
      </Form>
      <br />
      <br />
      <h3>Paid Fees</h3>
      <table>
        <thead>
          <tr>
            <td>Amount</td>
            <td>Batch</td>
            <td>Date</td>
            <td>Payment Type</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee, index) => {
            return (
              <tr key={fee._id}>
                <td>{fee.amount}</td>
                <td>{fee.batch}</td>
                <td>{dayjs(fee.date).toString().split(' ').slice(0,4).join(' ')}</td>
                <td>{fee.paymentType}</td>
                <td><Button type="primary" danger onClick={()=>handleDeleteFees(fee._id)}>Delete</Button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <br />
      <h3>Remaining Fees for Student</h3>
      <table>
        <thead>
          <tr>
            <td>Batch</td>
            <td>Total</td>
            <td>Paid</td>
            <td>Remaining</td>
          </tr>
        </thead>
        <tbody>
          {Object.entries(feesObject).map((entry, index) => {
           let fee = entry[0];
            return (
              <tr key={index}>
                <td>{fee}</td>
                <td>{feesObject[fee][0]}</td>
                <td>{feesObject[fee][1]}</td>
                <td>{parseFloat(feesObject[fee][0])-parseFloat(feesObject[fee][1])}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Batches({ id }) {
  const [allBatches, setAllBatches] = useState([]);
  const [batches, setBatches] = useState([]);
  const [show, setShow] = useState(false);
  const { slug } = useParams();
  const [batch, setBatch] = useState("");
  const [otherBatches, setOtherBatches] = useState([]);

  useEffect(() => {
    if (allBatches > 0) {
      setBatch(JSON.stringify(allBatches[0]));
    }
  }, [allBatches]);

  const onSubmit = async () => {
    let res = await addBatchForStudent(
      JSON.stringify({
        batchName: JSON.parse(batch).batchName,
        studentId: slug,
      })
    );
    if (JSON.parse(res).status === 200) {
      setShow(false);
    }
  };

  const deleteFromBatch = async(batch) => {
    let res = await deleteBatchForStudent(JSON.stringify({batch,id:slug}));
    if(JSON.parse(res).status === 200){
      message.success("Batch deleted");
      globalThis?.window?.location.reload();
    }
    else{
      message.error("Unable to delte batch !!")
    }
  }

  const handleGetBatch = async () => {
    let student = await axios.get("/api/students", {
      headers: {
        user: getUser(),
        id: slug,
      },
    });
    let temp = student.data.student.batches;
    // console.log(student,slug);
    if (temp.length > 0) {
      setBatches(temp);
    }

    let batchesTemp = await getBatchesforUser(getUser());
    let aux = [];
    let aux2 = [];
    if (batchesTemp.length > 0) {
      for (let i = 0; i < batchesTemp.length; i++) {
        if (!temp.includes(batchesTemp[i].batchName)) {
          aux.push(batchesTemp[i]);
        } else {
          aux2.push(batchesTemp[i]);
        }
      }
    }
    if (aux.length > 0) {
      setBatch(JSON.stringify(aux[0]));
    }

    if (aux2.length > 0) {
      setOtherBatches(aux2);
    }

    setAllBatches(aux);
  };

  useEffect(() => {
    handleGetBatch();
  }, []);

  return (
    <div>
      <div>
        <Button onClick={() => setShow((prev) => !prev)}>Add to Batch</Button>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <td>Batch Name</td>
              <td>Status</td>
              <td>Course</td>
              <td>Delete from Batch</td>
            </tr>
          </thead>

          <tbody>
            {otherBatches.length > 0 ? (
              otherBatches.map((bat) => {
                return (
                  <tr key={bat._id}>
                    <td>{bat.batchName}</td>
                    <td>{bat.active ? "Active" : "Not Active"}</td>
                    <td>{bat.courseName}</td>
                    <td>
                      <Button danger onClick={()=>deleteFromBatch(bat.batchName)}>Delete from Batch</Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4}>No Batches Added</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal
        title={"Add to Batch"}
        open={show}
        onClose={() => setShow(false)}
        onCancel={() => setShow(false)}
      >
        <div>
          <select onChange={(e) => setBatch(e.currentTarget.value)}>
            {allBatches.length > 0 &&
              allBatches.map((bat) => {
                return (
                  <option value={JSON.stringify(bat)}>{bat.batchName}</option>
                );
              })}
          </select>
          <br />
          {batch.length > 0 && <h5>{JSON.parse(batch).courseName}</h5>}
          <Button onClick={onSubmit}>Add</Button>
        </div>
      </Modal>
    </div>
  );
}

function EditStudent({ student, getStudentForUser }) {
  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [dob, setDob] = useState(student.dob);
  const [phone, setPhone] = useState(student.phone);
  const [address, setAddress] = useState(student.address);
  const [docId, setDocId] = useState(student.docId);
  const [doc, setDoc] = useState(student.doc);
  const [guardian, setGuardian] = useState(student.mothersOrGuardianName);
  const [father, setFather] = useState(student.fathersName);
  const [registrationNumber, setRegistrationNumber] = useState(
    student.registrationNumber
  );
  const [gender, setGender] = useState(student.gender);

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
      mothersOrGuardianName: guardian,
      fathersName: father,
      registrationNumber,
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
  const [user, setUser] = useState(null);
  const navigate = useRouter();
  useEffect(() => {
    setUser(getUser());
  }, []);

  const [student, setStudent] = useState(null);
  const [tabItems, setTabItems] = useState(null);

  const getStudentForUser = async () => {
    let res = await axios.get("/api/students", {
      headers: {
        user,
        id: slug,
      },
    });
    if (res.status === 200) {
      let data = res.data;
      setStudent(data.student);
    }
  };

  const handleDeleteStudent = async () => {
    let res = await axios.get(`/api/students/delete/${slug}`);
    if (res.status === 200) {
      message.success("Student Deleted Successfully");
      navigate.push("/students");
    }
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
        children: (
          <div>
            <Button type="primary" danger onClick={handleDeleteStudent}>
              Delete Student
            </Button>
          </div>
        ),
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
      },
      {
        key: "6",
        label: "Batches",
        children: <Batches />,
      },
      {
        key: "7",
        label: "View Fees",
        children: <FeesObject />,
      },
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
      <Tabs defaultActiveKey="1" items={tabItems} />
      <br />
    </div>
  );
}

export default Student;
