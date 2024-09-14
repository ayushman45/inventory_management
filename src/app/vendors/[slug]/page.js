"use client";
import {
  createOrUpdateVendor,
  getVendor,
} from "@/app/api/handlers/handleVendors";
import { getUser } from "@/helper/token";
import { parseString, stringifyObject } from "@/app/jsonHelper";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, message, Tabs, Typography } from "antd";
import { getLocaleDate } from "@/helper/date";
import AddVendorPurchase from "../AddVendorPurchase";
import ViewBills from "../ViewBills";
import Header from "@/Components/Header";
import axios from "axios";

const { Title, Paragraph, Text } = Typography;

function EditVendor({ vendor, getVendorForUser }) {
  const [name, setName] = useState(vendor.vendorName);
  const [email, setEmail] = useState(vendor.email);
  const [dob, setDob] = useState(vendor.dob);
  const [phone, setPhone] = useState(vendor.phone);
  const [address, setAddress] = useState(vendor.address);
  const [city, setCity] = useState(vendor.city);
  const [pincode, setPincode] = useState(vendor.pincode);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedVendor = {
      ...vendor,
      _id: vendor._id,
      name,
      email,
      dob,
      phone,
      address,
      city,
      pincode,
    };

    let res = await createOrUpdateVendor(
      stringifyObject({ ...updatedVendor })
    );
    if (parseString(res).status === 200) {
      getVendorForUser();
      message.success("Vendor Updated Successfully");
    } else {
      message.error("Failed to update vendor");
    }
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <label>Vendor Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Vendor Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Vendor DOB</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <label>Vendor Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <label>Vendor Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <label>Vendor City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <label>Vendor Pincode</label>
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

function Vendor() {
  const { slug } = useParams();
  const user = getUser();
  const [vendor, setVendor] = useState(null);
  const [tabItems, setTabItems] = useState(null);
  const navigate = useRouter();

  const getVendorForUser = async () => {
    let res = await getVendor(stringifyObject({ user, id: slug }));
    if (parseString(res).status === 200) {
      let data = JSON.parse(res).data;
      setVendor(data);
    }
  };

  const handleDeleteVendor = async () => {
    let res = await axios.get(`/api/vendors/delete/${slug}`);
    if(res.status===200){
      message.success("Vendor Deleted Successfully");
      navigate.push("/vendors");
    }

  }

  const onChange = (key) => {
    console.log(key);
  };

  useEffect(() => {
    if (!vendor) {
      return;
    }

    let jsx = (
      <div>
        <Title>{vendor.name}</Title>
        <Paragraph>
          <Text strong>Email:</Text> {vendor.email}
        </Paragraph>
        <Paragraph>
          <Text strong>Phone:</Text> {vendor.phone}
        </Paragraph>
        <Paragraph>
          <Text strong>DOB (DD/MM/YYYY) :</Text> {getLocaleDate(vendor.dob)}
        </Paragraph>
        <Paragraph>
          <Text strong>Address:</Text> {vendor.address}
        </Paragraph>
        <Paragraph>
          <Text strong>City:</Text> {vendor.city}
        </Paragraph>
        <Paragraph>
          <Text strong>Pincode:</Text> {vendor.pincode}
        </Paragraph>
      </div>
    );

    const items = [
      {
        key: "1",
        label: "Vendor Data",
        children: jsx,
      },
      {
        key: "2",
        label: "Edit",
        children: <EditVendor vendor={vendor} getVendorForUser={getVendorForUser} />,
      },
      {
        key: "3",
        label: "Delete",
        children: <div>
          <Button type="primary" danger onClick={handleDeleteVendor}>Delete Vendor</Button>
        </div>,
      },
      {
        key: "4",
        label:"Add Vendor Purchase",
        children: <AddVendorPurchase />
      },
      {
        key: "5",
        label:"View Vendor Purchase",
        children: <ViewBills />
      }
    ];

    setTabItems(items);
  }, [vendor]);

  useEffect(() => {
    if (!slug || !user) {
      return;
    }

    getVendorForUser();
  }, [slug, user]);
  return (
    <div>
      <Header />
      <br />
      {vendor && (
        <Tabs defaultActiveKey="1" items={tabItems} onChange={onChange} />
      )}
      {!vendor && <Title>Loading...</Title>}
    </div>
  );
}

export default Vendor;
