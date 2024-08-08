"use client"

import React, { useEffect } from 'react'
import { getToken } from '../helper/token';
import { useRouter } from 'next/navigation';

function Dashboard() {
  const navigate = useRouter();
  useEffect(() =>{
    let token = getToken();
    console.log(token);
    if(!token){
      navigate.push("/login");

    }

  },[]);

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard