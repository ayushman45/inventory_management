"use client";

import { Button, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import ModalHelper from "../../Components/ModalHelper";
import NewCourse from "./NewCourse";
import { getCoursesForUser } from "../../helper/getCourses";
import { getUser } from "../../helper/token";
import { importCoursesFromCSV } from "../api/handlers/handleCourses";
import { parseString, stringifyObject } from "../jsonHelper";
import Papa from "papaparse";
import Searchbar from "../../Components/Searchbar";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";

function Courses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState(null);
  const [user,setUser] = useState(null);
  useEffect(() => {
    setUser(getUser());

  }, []);
  const navigate = useRouter();

  const fetchCourses = async () => {
    let courses = await getCoursesForUser(user);
    setCourses(courses);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "courseName",
      key: "courseName",
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

  const handleImportCourses = () => {
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
          let res = await importCoursesFromCSV(
            stringifyObject({ user, data: results.data })
          );
          let response = parseString(res);
          if (response.status === 200) {
            message.success("Courses Imported Successfully");
            fetchCourses();
          } else {
            message.error("Failed to import courses");
          }
        },
      });
    };
    input.click();
  };

  const handleSearch = (id) => {
    navigate.push(`/courses/${id}`);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchCourses();
  }, [user]);

  return (
    <div>
      <Header />
      <br />
      <div className="row-flex wid-100 sp-between">
        <div className="row-flex wid-50 sp-between">
          {courses && (
            <Searchbar
              arrOfObj={courses}
              displayField={"courseName"}
              onClickHandler={handleSearch}
            />
          )}
        </div>
        <div className="row-flex wid-50 flex-end" style={{ gap: "10px" }}>
          <Button
            type="primary"
            onClick={() => setIsModalOpen((prev) => !prev)}
          >
            Add New Course
          </Button>
          <Button type="primary" onClick={handleImportCourses}>
            Import Courses
          </Button>
        </div>
      </div>

      <br />

      <ModalHelper
        ViewComponent={NewCourse}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      {courses?.length > 0 && (
        <Table
          dataSource={courses}
          columns={columns}
          rowKey={"_id"}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                navigate.push(`/courses/${record._id}`);
              },
            };
          }}
        />
      )}

      <br />
    </div>
  );
}

export default Courses;
