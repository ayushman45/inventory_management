import { Button } from 'antd';
import { useRouter } from 'next/navigation'
import React from 'react'

function Header() {
    const navigate = useRouter();

  return (
    <div className='row-flex wid-100'>
        <Button onClick={() => navigate.push('/dashboard')}>Dashboard</Button>
    </div>
  )
}

export default Header