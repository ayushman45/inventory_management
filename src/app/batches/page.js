"use client";

import { Button, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import ModalHelper from "../../Components/ModalHelper";
import { getBatchesforUser } from "../../helper/getCourses";
import { getUser } from "../../helper/token";
import Searchbar from "../../Components/Searchbar";
import { useRouter } from "next/navigation";
import Header from "@/Components/Header";
import NewBatch from "./NewBatch";

function Batches() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [batches, setBatches] = useState(null);
  const [user,setUser] = useState(null);
  useEffect(() => {
    setUser(getUser());

  }, []);
  const navigate = useRouter();

  const fetchBatches = async () => {
    let batches = await getBatchesforUser(user);
    setBatches(batches);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "batchName",
      key: "batchName",
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
    },
    {
      title: "Course",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
        title: "Start Date",
        dataIndex: "startDate",
        key: "startDate"
    }
  ];

  const handleSearch = (id) => {
    navigate.push(`/batches/${id}`);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchBatches();
  }, [user]);

  return (
    <div>
      <Header />
      <br />
      <div className="row-flex wid-100 sp-between">
        <div className="row-flex wid-50 sp-between">
          {batches && (
            <Searchbar
              arrOfObj={batches}
              displayField={"batchName"}
              onClickHandler={handleSearch}
            />
          )}
        </div>
        <div className="row-flex wid-50 flex-end" style={{ gap: "10px" }}>
          <Button
            type="primary"
            onClick={() => setIsModalOpen((prev) => !prev)}
          >
            Add New Batch
          </Button>
        </div>
      </div>

      <br />

      <ModalHelper
        ViewComponent={NewBatch}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      {batches?.length > 0 && (
        <Table
          dataSource={batches}
          columns={columns}
          rowKey={"_id"}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                navigate.push(`/batches/${record._id}`);
              },
            };
          }}
        />
      )}

      <br />
    </div>
  );
}

export default Batches;
