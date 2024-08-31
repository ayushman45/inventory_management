"use client"

import React, { useEffect } from 'react'
import { getToken, getUser } from '../helper/token';
import { useRouter } from 'next/navigation';
import { Button } from 'antd';

function Dashboard() {
  const navigate = useRouter();
  const user = getUser();
  
  useEffect(() =>{
    let token = getToken();
    console.log(token);
    if(!token){
      navigate.push("/login");

    }

  },[]);

  return (
    <div className='col-flex wid-100'>
      <br />
      <div className='row-flex wid-100' style={{justifyContent:"center"}}>
      <div className='row-flex ' style={{gap:"20px",flexWrap:"wrap"}}>
        <Button type='primary' onClick={()=>navigate.push('/customers')}>Customers</Button>
        <Button type='primary' onClick={()=>navigate.push('/vendors')}>Vendors</Button>
        <Button type='primary' onClick={()=>navigate.push('/services')}>Services</Button>
        <Button type='primary' onClick={()=>navigate.push('/products')}>Products</Button>
        <Button type='primary' onClick={()=>navigate.push('/expenses')}>Expenses</Button>
      </div>
      </div>
    </div>
    
  )
}

export default Dashboard