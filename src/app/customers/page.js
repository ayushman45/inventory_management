"use client"

import { Button } from 'antd'
import React, { useState } from 'react'
import ModalHelper from '../Components/ModalHelper';
import NewCustomer from './NewCustomer';

function Customers() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateNewCustomer = () => {

    }

  return (
    <div>
        <Button type="primary" onClick={()=>setIsModalOpen(prev=>!prev)}>Add New Customer</Button>
        <ModalHelper ViewComponent={NewCustomer} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

    </div>
  )
}

export default Customers