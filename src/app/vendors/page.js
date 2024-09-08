"use client";

import { Button, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import ModalHelper from "../Components/ModalHelper";
import NewVendor from "./NewVendor";
import { getVendorsForUser } from "../helper/getVendors";
import { getUser } from "../helper/token";
import { importVendorsFromCSV } from "../api/handlers/handleVendors";
import { parseString, stringifyObject } from "../jsonHelper";
import Papa from "papaparse";
import Searchbar from "../Components/Searchbar";
import { useRouter } from "next/navigation";
import Header from "@/app/Components/Header";

function Vendors() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendors, setVendors] = useState(null);
  const navigate = useRouter();

  const fetchVendors = async () => {
    let vendors = await getVendorsForUser(user);
    setVendors(vendors);
  };

  const [user,setUser] = useState(null);
  useEffect(() => {
    setUser(getUser());

  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "vendorName",
      key: "vendorName",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  const handleImportVendors = () => {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (e) => {
      let file = e.target.files[0];
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
          console.log(results);
          //dwst verify headers
          let res = await importVendorsFromCSV(
            stringifyObject({ user, data: results.data })
          );
          let response = parseString(res);
          if (response.status === 200) {
            message.success("Vendors Imported Successfully");
            fetchVendors();
          } else {
            message.error("Failed to import vendors");
          }
        },
      });
    };
    input.click();
  };

  const handleSearch = (id) => {
    navigate.push(`/vendors/${id}`);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchVendors();
  }, [user]);

  return (
    <div>
      <Header />
      <br />
      <div className="row-flex wid-100 sp-between">
        <div className="row-flex wid-50 sp-between">
          {vendors && (
            <Searchbar
              arrOfObj={vendors}
              displayField={"vendorName"}
              onClickHandler={handleSearch}
            />
          )}
        </div>
        <div className="row-flex wid-50 flex-end" style={{ gap: "10px" }}>
          <Button
            type="primary"
            onClick={() => setIsModalOpen((prev) => !prev)}
          >
            Add New Vendor
          </Button>
          <Button type="primary" onClick={handleImportVendors}>
            Import Vendors
          </Button>
        </div>
      </div>

      <br />

      <ModalHelper
        ViewComponent={NewVendor}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      {vendors?.length > 0 && (
        <Table
          dataSource={vendors}
          columns={columns}
          rowKey={"_id"}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                navigate.push(`/vendors/${record._id}`);
              },
            };
          }}
        />
      )}

      <br />
    </div>
  );
}

export default Vendors;
