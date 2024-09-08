"use client";

import {
  deletePurchase,
  getBillById,
  updatePurchase,
} from "@/app/api/handlers/handleBills";
import {
  createPayment,
  getPaymentsByBillId,
} from "@/app/api/handlers/handlePayments";
import { getPurchase } from "@/app/api/handlers/handlePurchases";
import { getVendorForBill } from "@/app/api/handlers/handleVendorPurchase";
import { convertAmountAddCommas } from "@/app/helper/amount";
import { getISODateString } from "@/app/helper/date";
import { getUser } from "@/app/helper/token";
import { parseString, stringifyObject } from "@/app/jsonHelper";
import { Button, DatePicker, Input, message, Select, Table } from "antd";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "@/app/Components/Header";

function Page() {
  const { slug } = useParams();
  const [user,setUser] = useState(null);
  useEffect(() => {
    setUser(getUser());

  }, []);

  const [bill, setBill] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [billProducts, setBillProducts] = useState(null);
  const [totalPaid, setTotalPaid] = useState(0);
  const [payments, setPayments] = useState([]);
  const [toBePaid, setToBePaid] = useState(0);
  const [payingDate, setPayingDate] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [paymentType, setPaymentType] = useState("upi");

  const handleMakePayment = async () => {
    console.log(toBePaid, payingDate);
    let payment = {
      billId: slug,
      vendorId: vendor,
      paymentType,
      amount: toBePaid,
      date: payingDate,
    };

    let res = await createPayment(
      stringifyObject({ payment, type: "vendor", user })
    );
    res = parseString(res);
    if (res.status === 200) {
      message.success("Payment made successfully");
      window.location.reload();
    } else {
      message.error("Failed to make payment");
    }
  };

  const handleDeletePayment = async (paymentId) => {
    let res = await deletePayment(
      stringifyObject({ paymentId, type: "vendor" })
    );
    res = parseString(res);
    console.log(res, "done");
    if (res.status === 200) {
      message.success("Payment deleted successfully", 3);
      window.location.reload();
    } else {
      message.error("Failed to delete payment", 3);
    }
  };

  const getTotalAmount = async () => {
    if (!bill || !bill.purchases || bill.purchases.length === 0) {
      return;
    }
    let total = 0;
    let products = [];
    for (const purchaseId of bill.purchases) {
      try {
        let res = await getPurchase(
          stringifyObject({ purchaseId, type: "vendor" })
        );
        res = parseString(res);
        if (res.status === 200) {
          total += res.data.amount;
          products.push(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setTotalAmount(total);
    setBillProducts(products);
  };

  const handleBillProductDelete = async (index) => {
    let purchaseId = billProducts[index]._id;
    let res = await deletePurchase(
      stringifyObject({ billId: slug, purchaseId, type: "vendor" })
    );
    res = parseString(res);
    if (res.status === 200) {
      message.success("Product deleted successfully");
      getTotalAmount();
    } else {
      message.error(res.message);
    }
  };

  const handleSaveProduct = async (index) => {
    let product = billProducts[index];
    let res = await updatePurchase(
      stringifyObject({ purchase: product, type: "vendor" })
    );
    res = parseString(res);
    if (res.status === 200) {
      message.success("Product updated successfully");
      getTotalAmount();
    } else {
      message.error("Failed to update product");
    }
  };

  const handleInputChange = (index, field, value, type = "product") => {
    if (type === "product") {
      setBillProducts((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          [field]: value,
        },
      }));
    } else {
      setBillServices((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          [field]: value,
        },
      }));
    }
  };

  const getBill = async () => {
    // fetch bill data from server
    try {
      let res = await getBillById(
        stringifyObject({ billId: slug, user, type: "vendor" })
      );
      res = parseString(res);
      if (res.status === 200) {
        setBill(res.data);
        console.log(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getAllPayments = async () => {
    let res = await getPaymentsByBillId(
      stringifyObject({ billId: slug, type: "vendor" })
    );
    res = parseString(res);
    if (res.status === 200) {
      let payments = res.data;
      setPayments(payments);
    }
  };

  const getVendor = async () => {
    let res = await getVendorForBill(stringifyObject({ billId: slug }));
    res = parseString(res);
    if (res.status === 200) {
      setVendor(res.data);
    }
  };

  useEffect(() => {
    let totalPaid = 0;
    for (const payment of payments) {
      totalPaid += payment.amount;
    }
    setTotalPaid(totalPaid);
  }, [payments]);

  useEffect(() => {
    getBill();
    getAllPayments();
    getVendor();
  }, [slug,user]); // Add slug as a dependency

  useEffect(() => {
    getTotalAmount();
  }, [bill]);

  if (!vendor || !billProducts) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <br />
      {bill && <h1>Vendor Bill #{bill._id}</h1>}
      <p>Date: {bill && getISODateString(bill.date)}</p>
      <p>Total Amount: {convertAmountAddCommas(totalAmount)}</p>

      <p>Total Paid : {convertAmountAddCommas(totalPaid)}</p>
      <br />
      <br />
      {Object.keys(billProducts).map((index) => (
        <div key={index} className="product-component">
          <label>
            Product Name:
            <Input value={billProducts[index]?.productName || ""} disabled />
          </label>
          <label>
            Quantity:
            <Input
              type="number"
              placeholder="Enter Quantity"
              onChange={(e) =>
                handleInputChange(index, "quantity", e.target.value, "product")
              }
              value={billProducts[index]?.quantity || ""}
            />
          </label>
          <label>
            Price:
            <Input
              type="number"
              placeholder="Enter Price"
              onChange={(e) =>
                handleInputChange(index, "amount", e.target.value, "product")
              }
              value={billProducts[index]?.amount || ""}
            />
          </label>
          <br />
          <br />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "auto",
              gap: "10px",
            }}
          >
            <Button
              type="primary"
              danger
              onClick={() => handleBillProductDelete(index)}
            >
              Delete Product
            </Button>

            <Button type="primary" onClick={() => handleSaveProduct(index)}>
              Save Product
            </Button>
          </div>
        </div>
      ))}
      <br />
      <br />
      {payments.length > 0 && (
        <div>
          <h2>All Payments</h2>
          <Table
            columns={[
              {
                title: "Date",
                dataIndex: "date",
                key: "date",
                render: (date) => getISODateString(date),
              },
              { title: "Amount", dataIndex: "amount", key: "amount" },
              {
                title: "Payment Type",
                dataIndex: "paymentType",
                key: "paymentType",
              },
              {
                title: "Delete",
                key: "payment",
                render: (payment) => (
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleDeletePayment(payment._id)}
                  >
                    Delete
                  </Button>
                ),
              },
            ]}
            dataSource={payments}
            rowKey={(record) => record._id}
            pagination={{ pageSize: 5 }}
          />
        </div>
      )}
      <br />
      <br />
      <h2>Add Payment</h2>
      <label
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
        }}
      >
        Amount:
        <Input
          style={{ width: "200px" }}
          type="number"
          placeholder="Enter Amount"
          onChange={(e) => setToBePaid(Number(e.target.value))}
          value={toBePaid}
        />
      </label>
      <br />
      <br />
      <label
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
        }}
      >
        Date:
        <DatePicker
          onChange={(e, date) => {
            setPayingDate(date);
          }}
        />
      </label>
      <br />
      <br />
      <label
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
        }}
      >
        Payment Mode:
        <Select
          style={{ width: "200px" }}
          placeholder="Select Payment Mode"
          onChange={(value) => setPaymentType(value)}
          value={paymentType}
        >
          <Select.Option value="upi">UPI</Select.Option>
          <Select.Option value="cash">Cash</Select.Option>
          <Select.Option value="debit-card">Debit Card</Select.Option>
          <Select.Option value="credit-card">Credit Card</Select.Option>
          <Select.Option value="cheque">Cheque</Select.Option>
          <Select.Option value="online">NetBanking</Select.Option>
        </Select>
      </label>
      <br />
      <br />
      <Button type="primary" onClick={handleMakePayment}>
        Add Payment
      </Button>
    </div>
  );
}

export default Page;
