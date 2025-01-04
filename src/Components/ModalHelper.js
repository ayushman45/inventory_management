"use client";
import { Modal } from "antd";
import React, { useState } from "react";

function ModalHelper({ ViewComponent,isModalOpen,setIsModalOpen,courses }) {
  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Modal open={isModalOpen} closable={true} footer={null} onCancel={handleClose}>
        <ViewComponent onClose={handleClose} courses={courses} />
      </Modal>
    </div>
  );
}

export default ModalHelper;
