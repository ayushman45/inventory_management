"use client"

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getUser } from '../helper/token';
import { getBillsForCustomer } from '../api/handlers/handleBills';
import { parseString, stringifyObject } from '../jsonHelper';
import { message, Table } from 'antd';

function ViewBills() {
    const {slug} = useParams();
    const user = getUser();
    const [bills,setBills]=useState(null);

    const getBills = async() => {
        // fetch bills from server
        let res = await getBillsForCustomer(stringifyObject({customerId:slug,user}));
        res = parseString(res);
        console.log(res)
        if(res.status === 200) {
            setBills(res.data);

        }
        else {
            message.warning('No bills');

        }
    }

    const columns = [
        {
          title: "Bill Id",
          dataIndex: "_id",
          key: "_id",
        },
        {
          title: "Date",
          dataIndex: "date",
          key: "date",
        },

      ];
    

    useEffect(() => {
        getBills();

    }, [])
    
  return (
    <div>
        {
            bills && bills.length > 0 && (
                <Table 
                dataSource={bills} 
                columns={columns} 
                rowKey={'_id'}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: (event) => {navigate.push(`/bills/${record._id}`)},
                  }}}
                />
              )
        }
    </div>
  )
}

export default ViewBills