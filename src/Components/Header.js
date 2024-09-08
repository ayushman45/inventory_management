"use client"

import { Button } from 'antd';
import { useRouter } from 'next/navigation'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { removeInvUser, removeToken } from '../helper/token';

function Header() {
    const [flag, setFlag] = useState(null);

    useEffect(()=>{
        let arr = window.location.pathname.split('/');
        if(arr[arr.length-1] === 'login'){
            setFlag(false);
        }
        else{
            setFlag(true);
        }

    },[])
    const navigate = useRouter();
    const handleLogout = () => {
        removeInvUser();
        removeToken();
        navigate.push("/",{replace: true});

    }


  return (
    <div className='row-flex wid-100 sp-between'>
        <Button onClick={() => navigate.push('/dashboard')}>Dashboard</Button>
        {flag && <Button type='primary' danger onClick={handleLogout}>Logout</Button>}

    </div>
  )
}

export default Header