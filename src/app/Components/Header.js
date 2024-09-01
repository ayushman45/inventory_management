"use client"

import { Button } from 'antd';
import { useRouter } from 'next/navigation'
import React, { useEffect, useLayoutEffect } from 'react'
import { removeInvUser, removeToken } from '../helper/token';

function Header() {
    const navigate = useRouter();

    const handleLogout = () => {
        removeInvUser();
        removeToken();
        navigate.push("/",{replace: true});

    }

    useEffect(()=>{
        console.log(window.location.href.split('/'))
    },[])

  return (
    <div className='row-flex wid-100 sp-between'>
        <Button onClick={() => navigate.push('/dashboard')}>Dashboard</Button>
        <Button type='primary' danger onClick={handleLogout}>Logout</Button>

    </div>
  )
}

export default Header