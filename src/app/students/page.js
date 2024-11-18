"use client";

import { Button, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import ModalHelper from "../../Components/ModalHelper";
import NewStudent from "./NewStudent";
import { getStudentsForUser } from "../../helper/getStudents";
import { getUser } from "../../helper/token";
import { importStudentsFromCSV } from "../api/handlers/handleStudents";
import { parseString, stringifyObject } from "../jsonHelper";
import Papa from "papaparse";
import Searchbar from "../../Components/Searchbar";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";
function Students() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState(null);
  const [user,setUser] = useState(null);
  useEffect(() => {
    setUser(getUser());

  }, []);
  const navigate = useRouter();

  const fetchStudents = async () => {
    let students = await getStudentsForUser(user);
    setStudents(students);
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
    {
      title: "Registration Number",
      dataIndex: "registrationNumber",
      key: "registrationNumber",
    },
  ];

  const handleImportStudents = () => {
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
          let res = await importStudentsFromCSV(
            stringifyObject({ user, data: results.data })
          );
          let response = parseString(res);
          if (response.status === 200) {
            message.success("Students Imported Successfully");
            fetchStudents();
          } else {
            message.error("Failed to import students");
          }
        },
      });
    };
    input.click();
  };

  const handleSearch = (id) => {
    navigate.push(`/students/${id}`);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchStudents();
  }, [user]);

  return (
    <div>
      <Header />
      <br />
      <div className="row-flex wid-100 sp-between">
        <div className="row-flex wid-50 sp-between">
          {students && (
            <Searchbar
              arrOfObj={students}
              displayField={"name"}
              onClickHandler={handleSearch}
            />
          )}
        </div>
        <div className="row-flex wid-50 flex-end" style={{ gap: "10px" }}>
          <Button
            type="primary"
            onClick={() => setIsModalOpen((prev) => !prev)}
          >
            Add New Student
          </Button>
          <Button type="primary" onClick={handleImportStudents}>
            Import Students
          </Button>
        </div>
      </div>

      <br />

      <ModalHelper
        ViewComponent={NewStudent}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      {students?.length > 0 && (
        <Table
          dataSource={students}
          columns={columns}
          rowKey={"_id"}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                navigate.push(`/students/${record._id}`);
              },
            };
          }}
        />
      )}

      <br />
    </div>
  );
}

export default Students;
