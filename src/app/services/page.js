"use client";

import { Button, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import ModalHelper from "../../Components/ModalHelper";
import NewService from "./NewService";
import { getServicesForUser } from "../../helper/getServices";
import { getUser } from "../../helper/token";
import { importServicesFromCSV } from "../api/handlers/handleServices";
import { parseString, stringifyObject } from "../jsonHelper";
import Papa from "papaparse";
import Searchbar from "../../Components/Searchbar";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";

function Services() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState(null);
  const [user,setUser] = useState(null);
  useEffect(() => {
    setUser(getUser());

  }, []);
  const navigate = useRouter();

  const fetchServices = async () => {
    let services = await getServicesForUser(user);
    setServices(services);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  const handleImportServices = () => {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (e) => {
      let file = e.target.files[0];
      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
          //dwst verify headers
          let res = await importServicesFromCSV(
            stringifyObject({ user, data: results.data })
          );
          let response = parseString(res);
          if (response.status === 200) {
            message.success("Services Imported Successfully");
            fetchServices();
          } else {
            message.error("Failed to import services");
          }
        },
      });
    };
    input.click();
  };

  const handleSearch = (id) => {
    navigate.push(`/services/${id}`);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchServices();
  }, [user]);

  return (
    <div>
      <Header />
      <br />
      <div className="row-flex wid-100 sp-between">
        <div className="row-flex wid-50 sp-between">
          {services && (
            <Searchbar
              arrOfObj={services}
              displayField={"serviceName"}
              onClickHandler={handleSearch}
            />
          )}
        </div>
        <div className="row-flex wid-50 flex-end" style={{ gap: "10px" }}>
          <Button
            type="primary"
            onClick={() => setIsModalOpen((prev) => !prev)}
          >
            Add New Service
          </Button>
          <Button type="primary" onClick={handleImportServices}>
            Import Services
          </Button>
        </div>
      </div>

      <br />

      <ModalHelper
        ViewComponent={NewService}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      {services?.length > 0 && (
        <Table
          dataSource={services}
          columns={columns}
          rowKey={"_id"}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                navigate.push(`/services/${record._id}`);
              },
            };
          }}
        />
      )}

      <br />
    </div>
  );
}

export default Services;
