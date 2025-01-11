"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { getUser } from "../../helper/token";
import { stringifyObject } from "../jsonHelper";
import { Table } from "antd";
import { getISODateString } from "../../helper/date";
import axios from "axios";
import './style.css'

function ShowTable({productList}){
  const [ total, setTotal ] = useState(0);
  const [arr,setArr] = useState(productList.split(","));

  useEffect(()=>{
    let tot = 0;
    for(let i = 0; i<arr.length; i++){
      let dat = arr[i].split('$')[1];
      if(dat){
        tot+=parseInt(dat);
      }
      
      console.log(tot);
    }
    setTotal(tot);
  },[arr]);
 

  return(
    <table>
      <thead>
        <tr>
          <th>
            Product Name
          </th>
          <th>
            Quantity
          </th>
        </tr>
      </thead>
      <tbody>
        {
          arr.map(row=>{
            let data = row.split('$');
            if(!data[0] || !data[1]){
              return;
            }
            
            return(
              <tr>
                <td>{data[0]}</td>
                <td>{data[1]}</td>
              </tr>
            )
          })
        }
        <tr>
          <td>Total</td>
          <td>{total}</td>
        </tr>
      </tbody>
    </table>
  )
}

function ViewBills() {
  const { slug } = useParams();
  const user = getUser();
  const [bills, setBills] = useState(null);
  const navigate = useRouter();
  const [products, setProducts] = useState({});
  

  const setProductsForBill = async () => {
    if (!bills) {
      return;
    }

    for (let i = 0; i < bills.length; i++) {
      let data = stringifyObject({
        purchases: bills[i].purchases,
        type: "vendor",
      });
      try{
        let response = await axios.post("/api/bills/products", data);
        if (response.status === 200) {
          setProducts((prev) => {
            return { ...prev, [bills[i]._id]: response.data.summary };
          });
        }
      }
      
      catch(err){
        console.log(err.message)
        let resp = await axios.get('/api/bills/verification',{
          headers:{
            id: slug,
            billId: bills[i]._id,
            user: user,
            type: "vendor"
          }
        })
        if(resp.data.status===200){
          window.location.reload();
        }
      }
    }
    
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
      dataIndex: "invoice",
      key: "_id",
      render: (invoice) => {
        return invoice || "NA"
      }
    },
    {
      title: "Purchases",
      key: "purchases",
      dataIndex: "_id",
      render: (_id) => {
        const productList = products?.[_id] || [];
        return productList&&productList.length>0 ? <ShowTable productList={productList} /> : "No products";
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
