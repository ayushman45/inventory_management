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
  const [products, setProducts] = useState(null);
  

  const setProductsForBill = async() => {
    if(!bills){
      return;
    }
    let temp={};
    for(let i=0; i<bills.length; i++) {
      let data = stringifyObject({ purchases: bills[i].purchases, type: "customer" });
      let response = await axios.post('/api/bills/products',data);
      console.log(response)
      if (response.status === 200) {
        temp[bills[i]._id] = response.data.summary;
        
      }
      else{
        break;
      }
    }
    setProducts(temp);
  
    
  };

  useEffect(() => {
    setProductsForBill();

  }, [bills]);

  const getBills = async () => {
    // fetch bills from server
      let res = await axios.get(`/api/bills`,{
        headers:{
          id: slug,
          user: user,
          type: "customer"
        }
      });
      console.log(res)
      if(res.status===200){
          setBills(res.data.bills);
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
    try{
        getBills()
    }
    catch(err){
        console.log(err.message)
    }

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
