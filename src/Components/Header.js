"use client"

import { Button, Typography } from 'antd';
import { useRouter } from 'next/navigation'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { getUser, removeInvUser, removeToken } from '../helper/token';

function Header() {
    const [flag, setFlag] = useState(null);
    const [user,setUser]=useState(null);

    useEffect(()=>{
        setUser(getUser());
    },[]);

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
        <div className='row-flex' style={{gap:"10px",justifyContent:"center",alignItems:"center"}}>
            <Typography.Title style={{padding:"0",margin:"0"}} level={3} type='success'>{user}</Typography.Title>
            {flag && <Button type='primary' danger onClick={handleLogout}>Logout</Button>}
        </div>

    </div>
  )
}

export default Header