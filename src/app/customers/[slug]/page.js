"use client"
import { getCustomer } from '@/app/api/handlers/customerHandler';
import { getUser } from '@/app/helper/token';
import { parseString, stringifyObject } from '@/app/jsonHelper';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function Customer() {
    const { slug } = useParams('customer');
    const user = getUser();
    const [customer,setCustomer] = useState(null);

    const getCustomerForUser = async() =>{
        let res = await getCustomer(stringifyObject({user,id:slug}));
        console.log(parseString(res));
        if(parseString(res).status === 200){
          let data = JSON.parse(res).data;
          setCustomer(data);
        }
    }

    useEffect(()=>{
        getCustomerForUser();

    },[slug,user])
  return (
    <div>Customer is {customer?.name || "Loading..."}</div>
  )
}

export default Customer