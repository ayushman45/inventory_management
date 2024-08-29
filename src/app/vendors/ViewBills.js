"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { getUser } from "../helper/token";
import {
  getBillProducts,
  getBillsForVendor,
} from "../api/handlers/handleBills";
import { parseString, stringifyObject } from "../jsonHelper";
import { message, Table } from "antd";

function ViewBills() {
  const { slug } = useParams();
  const user = getUser();
  const [bills, setBills] = useState(null);
  const navigate = useRouter();
  const [products, setProducts] = useState(null);

  const setProductsForBill = () => {
    if(!bills){
      return;
    }
    
    bills.forEach(async (bill) => {
      let productsForBill = await getBillProducts(
        stringifyObject({ purchases: bill.purchases, type: "vendor" })
      );
      productsForBill = parseString(productsForBill);
      console.log(productsForBill,"done")
      if (productsForBill.status === 200) {
        let temp = products ? { ...products } : {};
        temp[bill._id] = productsForBill.data;
        console.log(temp,productsForBill.data);
        setProducts(temp);

      } else {
        message.warning("No products found for this bill");

      }
    });
  };

  useEffect(() => {
    setProductsForBill();

  }, [bills]);

  const getBills = async () => {
    // fetch bills from server
    let res = await getBillsForVendor(
      stringifyObject({ vendorId: slug, user })
    );
    res = parseString(res);
    console.log(res);
    if (res.status === 200) {
      setBills(res.data);
    } else {
      message.warning("No bills");
    }
  };

  const columns = useMemo(
    () => [
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
          return productList? productList : "No products"
        },
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
      },
    ],
    [products]
  );

  useEffect(() => {
    if(!slug || !user){
      return;

    }

    getBills();

  }, [slug,user]);

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
