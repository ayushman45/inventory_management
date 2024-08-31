"use client";

import { Button, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import ModalHelper from "../Components/ModalHelper";
import NewCustomer from "./NewCustomer";
import { getCustomersForUser } from "../helper/getCustomers";
import { getUser } from "../helper/token";
import { importCustomersFromCSV } from "../api/handlers/handleCustomers";
import { parseString, stringifyObject } from "../jsonHelper";
import Papa from "papaparse";
import Searchbar from "../Components/Searchbar";
import { useRouter } from "next/navigation";
import { config } from "../config";
function Customers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState(null);
  const user = getUser();
  const navigate = useRouter();

  const fetchCustomers = async () => {
    let customers = await getCustomersForUser(user);
    setCustomers(customers);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  const handleImportCustomers = () => {
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
          let res = await importCustomersFromCSV(
            stringifyObject({ user, data: results.data })
          );
          let response = parseString(res);
          if (response.status === 200) {
            message.success("Customers Imported Successfully");
            fetchCustomers();
          } else {
            message.error("Failed to import customers");
          }
        },
      });
    };
    input.click();
  };

  const handleSearch = (id) => {
    navigate.push(`/customers/${id}`);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchCustomers();
  }, [user]);

  return (
    <div>
      <div className="row-flex wid-100 sp-between">
        <div className="row-flex wid-50 sp-between">
        {customers && (
        <Searchbar
          arrOfObj={customers}
          displayField={"name"}
          onClickHandler={handleSearch}
        />
      )}
        </div>
      <div className="row-flex wid-50 flex-end" style={{gap:"10px"}}>
        <Button type="primary" onClick={() => setIsModalOpen((prev) => !prev)}>
          Add New Customer
        </Button>
        <Button type="primary" onClick={handleImportCustomers}>
          Import Customers
        </Button>
      </div>
      </div>

      <br />

      <ModalHelper
        ViewComponent={NewCustomer}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      {customers?.length > 0 && (
        <Table 
        dataSource={customers} 
        columns={columns} 
        rowKey={'_id'}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {navigate.push(`/customers/${record._id}`)},
          }}}
        />
      )}

      <br />

     </div>
  );
}

export default Customers;