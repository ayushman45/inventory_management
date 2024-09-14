"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { getUser } from "../../helper/token";
import { stringifyObject } from "../jsonHelper";
import { Table } from "antd";
import { getISODateString } from "../../helper/date";
import axios from "axios";

function ViewBills() {
  const { slug } = useParams();
  const user = getUser();
  const [bills, setBills] = useState(null);
  const navigate = useRouter();
  const [products, setProducts] = useState({});
  const [flag, setFlag] = useState(null);

  const setProductsForBill = async () => {
    if (!bills) {
      return;
    }

    for (let i = 0; i < bills.length; i++) {
      let data = stringifyObject({
        purchases: bills[i].purchases,
        type: "vendor",
      });

      let response = await axios.post("/api/bills/products", data);
      console.log(response)
      if (response.status === 200) {
        setProducts((prev) => {
          return { ...prev, [bills[i]._id]: response.data.summary };
        });
      }
    }
    setFlag(true);
  };

  useEffect(() => {
    setProductsForBill();
  }, [bills]);

  const getBills = async () => {
    // fetch bills from server
    let res = await axios.get(`/api/bills/vendor`, {
      headers: {
        user,
        vendor: slug,
      },
    });
    if (res.status === 200) {
      setBills(res.data.bills);
    }
  };

  const columns = useMemo(
    ()=>[
    {
      title: "Bill Id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Purchases",
      key: "purchases",
      dataIndex: "_id",
      render: (_id) => {
        const productList = products?.[_id] || [];
        return productList ? productList : "No products";
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => getISODateString(date),
    },
  ],[products]);

  useEffect(() => {
    if (!slug || !user) {
      return;
    }

    getBills();
  }, [slug, user]);

  if(!flag){
    return <div>Loading...</div>
  }

  return (
    <div>
      {bills && bills.length > 0 && (
        <Table
          dataSource={bills}
          columns={columns}
          rowKey={"_id"}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                navigate.push(`/vendorbills/${record._id}`);
              },
            };
          }}
        />
      )}
    </div>
  );
}

export default ViewBills;
