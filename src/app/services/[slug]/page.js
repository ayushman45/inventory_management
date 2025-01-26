"use client";
import {
  createOrUpdateService,
  getService,
} from "@/app/api/handlers/handleServices";
import { getUser } from "@/helper/token";
import { parseString, stringifyObject } from "@/app/jsonHelper";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, message, Tabs, Typography } from "antd";
import { getLocaleDate } from "@/helper/date";
import Header from "@/Components/Header";
import axios from "axios";

const { Title, Paragraph, Text } = Typography;

function EditService({ service, getServiceForUser }) {
  const [serviceName, setServiceName] = useState(service.serviceName);
  const [type, setType] = useState(service.type);
  const [description, setDescription] = useState(service.description)

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedService = {
      ...service,
      _id: service._id,
      serviceName,
      type,
      description,
    };

    let res = await createOrUpdateService(
      stringifyObject({ ...updatedService })
    );
    if (parseString(res).status === 200) {
      getServiceForUser();
      message.success("Service Updated Successfully");
    } else {
      message.error("Failed to update service");
    }
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <label>Service Name</label>
        <input
          type="text"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
        />
        <label>Type</label>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <label>Service Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

function Service() {
  const { slug } = useParams();
  const user = getUser();
  const [service, setService] = useState(null);
  const [tabItems, setTabItems] = useState(null);
  const navigate = useRouter();

  const handleDeleteService = async () => {
    let res = await axios.get(`/api/services/delete/${slug}`);
    if(res.status===200){
      message.success("Service deleted successfully");
      navigate.push("/services");
      
    }
  
  }

  const getServiceForUser = async () => {
    let res = await getService(stringifyObject({ user, id: slug }));
    if (parseString(res).status === 200) {
      let data = JSON.parse(res).data;
      setService(data);
    }
  };

  const onChange = (key) => {
    // console.log(key);
  };

  useEffect(() => {
    if (!service) {
      return;
    }

    let jsx = (
      <div>
        <Title>{service.serviceName}</Title>
        <Paragraph>
          <Text strong>Type:</Text> {service.type}
        </Paragraph>
        <Paragraph>
          <Text strong>Service Description:</Text> {service.description}
        </Paragraph>
      </div>
    );

    const items = [
      {
        key: "1",
        label: "Service Data",
        children: jsx,
      },
      {
        key: "2",
        label: "Edit",
        children: <EditService service={service} getServiceForUser={getServiceForUser} />,
      },
      {
        key: "3",
        label: "Delete",
        children: <div>
          <Button type="primary" danger onClick={handleDeleteService}>Delete Service</Button>
        </div>,
      },
    ];

    setTabItems(items);

  }, [service]);

  useEffect(() => {
    if (!slug || !user) {
      return;
    }

    getServiceForUser();
  }, [slug, user]);
  return (
    <div>
      <Header />
      <br />
      {service && (
        <Tabs defaultActiveKey="1" items={tabItems} onChange={onChange} />
      )}
      {!service && <Title>Loading...</Title>}
    </div>
  );
}

export default Service;
