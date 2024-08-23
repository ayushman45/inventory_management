"use client";
import {
  createOrUpdateCustomer,
  getCustomer,
} from "@/app/api/handlers/customerHandler";
import { getUser } from "@/app/helper/token";
import { parseString, stringifyObject } from "@/app/jsonHelper";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Tabs, Typography } from "antd";
import { getLocaleDate } from "@/app/helper/date";
import AddCustomerPurchase from "../AddCustomerPurchase";
import ModalHelper from "@/app/Components/ModalHelper";

const { Title, Paragraph, Text } = Typography;

function EditCustomer({ customer, getCustomerForUser }) {
  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email);
  const [dob, setDob] = useState(customer.dob);
  const [phone, setPhone] = useState(customer.phone);
  const [address, setAddress] = useState(customer.address);
  const [city, setCity] = useState(customer.city);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedCustomer = {
      ...customer,
      _id: customer._id,
      name,
      email,
      dob,
      phone,
      address,
      city,
    };

    console.log(updatedCustomer);
    let res = await createOrUpdateCustomer(
      stringifyObject({ ...updatedCustomer })
    );
    console.log(parseString(res));
    if (parseString(res).status === 200) {
      getCustomerForUser();
      message.success("Customer Updated Successfully");
    } else {
      message.error("Failed to update customer");
    }
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <label>Customer Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Customer Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Customer DOB</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <label>Customer Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <label>Customer Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <label>Customer City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

function Customer() {
  const { slug } = useParams();
  const user = getUser();
  const [customer, setCustomer] = useState(null);
  const [tabItems, setTabItems] = useState(null);

  const getCustomerForUser = async () => {
    let res = await getCustomer(stringifyObject({ user, id: slug }));
    console.log(parseString(res));
    if (parseString(res).status === 200) {
      let data = JSON.parse(res).data;
      setCustomer(data);
    }
  };

  const onChange = (key) => {
    console.log(key);
  };

  useEffect(() => {
    if (!customer) {
      return;
    }

    let jsx = (
      <div>
        <Title>{customer.name}</Title>
        <Paragraph>
          <Text strong>Email:</Text> {customer.email}
        </Paragraph>
        <Paragraph>
          <Text strong>Phone:</Text> {customer.phone}
        </Paragraph>
        <Paragraph>
          <Text strong>DOB (DD/MM/YYYY) :</Text> {getLocaleDate(customer.dob)}
        </Paragraph>
        <Paragraph>
          <Text strong>Address:</Text> {customer.address}
        </Paragraph>
        <Paragraph>
          <Text strong>City:</Text> {customer.city}
        </Paragraph>
      </div>
    );

    const items = [
      {
        key: "1",
        label: "Customer Data",
        children: jsx,
      },
      {
        key: "2",
        label: "Edit",
        children: (
          <EditCustomer
            customer={customer}
            getCustomerForUser={getCustomerForUser}
          />
        ),
      },
      {
        key: "3",
        label: "Delete",
        children: <div>Delete Customer</div>,
      },
      {
        key: "4",
        label: "Add Bills",
        children: <AddCustomerPurchase />,
      },
    ];

    setTabItems(items);

  }, [customer]);

  useEffect(() => {
    if (!slug || !user) {
      return;
    }

    getCustomerForUser();
  }, [slug, user]);

  if (!customer) {
    return <div>Loading ...</div>;
  }
  return (
    <div>
      <Tabs defaultActiveKey="1" items={tabItems} onChange={onChange} />
      <br />
    </div>
  );
}

export default Customer;