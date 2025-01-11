"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { getUser } from "../../helper/token";
import { stringifyObject } from "../jsonHelper";
import { Table } from "antd";
import { getISODateString } from "../../helper/date";
import axios from "axios";

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
  const [products, setProducts] = useState(null);
  

  const setProductsForBill = async() => {
    if(!bills){
      return;
    }
    let temp={};
    for(let i=0; i<bills.length; i++) {
      let data = stringifyObject({ purchases: bills[i].purchases, type: "customer" });
      try{
        let response = await axios.post('/api/bills/products',data);
        if (response.status === 200) {
          temp[bills[i]._id] = response.data.summary;
          
        }
      }
      catch(err){
        let resp = await axios.get('/api/bills/verification',{
          headers:{
            id: slug,
            billId: bills[i]._id,
            user: user,
            type: "customer"
          }
        })
        if(resp.status === 200) {
          window.location.reload();
        }
      }
      
    }
    setProducts(temp);
  
    
  };

  useEffect(() => {
    try{
      setProductsForBill();
    }
    catch(err){
      console.log(err.message)
    }

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
          return productList&&productList.length>0? <ShowTable productList={productList} /> : "No products"
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
