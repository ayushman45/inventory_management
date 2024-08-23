"use client";
import {
  createOrUpdateVendor,
  getVendor,
} from "@/app/api/handlers/vendorHandler";
import { getUser } from "@/app/helper/token";
import { parseString, stringifyObject } from "@/app/jsonHelper";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { message, Tabs, Typography } from "antd";
import { getLocaleDate } from "@/app/helper/date";

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

    console.log(updatedVendor);
    let res = await createOrUpdateVendor(
      stringifyObject({ ...updatedVendor })
    );
    console.log(parseString(res));
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
  const [vendorData, setVendorData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [tabItems, setTabItems] = useState(null);

  const getVendorForUser = async () => {
    let res = await getVendor(stringifyObject({ user, id: slug }));
    console.log(parseString(res));
    if (parseString(res).status === 200) {
      let data = JSON.parse(res).data;
      setVendor(data);
    }
  };

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
        children: <div>Delete Vendor</div>,
      },
    ];

    setTabItems(items);

    setVendorData(jsx);
  }, [vendor]);

  useEffect(() => {
    if (!slug || !user) {
      return;
    }

    getVendorForUser();
  }, [slug, user]);
  return (
    <div>
      {vendor && (
        <Tabs defaultActiveKey="1" items={tabItems} onChange={onChange} />
      )}
      {!vendor && <Title>Loading...</Title>}
    </div>
  );
}

export default Vendor;
