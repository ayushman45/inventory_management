"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { getUser } from "../helper/token";
import {
  getBillProducts,
  getBillsForCustomer,
  getBillsForVendor,
} from "../api/handlers/handleBills";
import { parseString, stringifyObject } from "../jsonHelper";
import { message, Table } from "antd";
import { getISODateString } from "../helper/date";

function ViewBills() {
  const { slug } = useParams();
  const user = getUser();
  const [bills, setBills] = useState(null);
  const navigate = useRouter();
  const [products, setProducts] = useState(null);

  const setProductsForBill = async() => {
    if(!bills){
      return;
    }

    for(let i=0; i<bills.length; i++) {
      let productsForBill = await getBillProducts(
        stringifyObject({ purchases: bills[i].purchases, type: "customer" })
      );
      productsForBill = parseString(productsForBill); 
      if (productsForBill.status === 200) {
        setProducts(prev=>{
          return {...prev, [bills[i]._id]: productsForBill.data };
        });
      } else {
        message.warning("No products found for this bill");
      }
    }
    
  };

  useEffect(() => {
    setProductsForBill();

  }, [bills]);

  const getBills = async () => {
    // fetch bills from server
    let res = await getBillsForCustomer(
      stringifyObject({ customerId: slug, user })
    );
    res = parseString(res);
    if (res.status === 200) {
      setBills(res.data);
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
        render: (date)=>getISODateString(date)
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
                navigate.push(`/bills/${record._id}`);
              },
            };
          }}
        />
      )}
    </div>
  );
}

export default ViewBills;
