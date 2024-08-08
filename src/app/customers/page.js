"use client";

import { Button, message } from "antd";
import React, { useEffect, useState } from "react";
import ModalHelper from "../Components/ModalHelper";
import NewCustomer from "./NewCustomer";
import { getCustomersForUser } from "../helper/getCustomers";
import { getUser } from "../helper/token";
import { importCustomersFromCSV } from "../api/handlers/customerHandler";
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
    console.log(customers);
    setCustomers(customers);
  };

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
    navigate.push(`${config.baseUrl}/customers/${id}`);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchCustomers();
  }, [user]);

  return (
    <div>
      {customers && (
        <Searchbar
          arrOfObj={customers}
          displayField={"name"}
          onClickHandler={handleSearch}
        />
      )}
      <br />
      <Button type="primary" onClick={() => setIsModalOpen((prev) => !prev)}>
        Add New Customer
      </Button>
      <Button type="primary" onClick={handleImportCustomers}>
        Import Customers
      </Button>
      <br />

      <ModalHelper
        ViewComponent={NewCustomer}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      {customers &&
        customers.map((customer) => (
          <div key={customer._id}>{customer.name}</div>
        ))}
    </div>
  );
}

export default Customers;
