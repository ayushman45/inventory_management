"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { getUser } from "../../helper/token";
import { getProductsForUser } from "../../helper/getProducts";
import { Button, DatePicker, Input, message, Select } from "antd";
import { getLocaleDate } from "../../helper/date";
import { createVendorBill } from "../api/handlers/handleVendorPurchase";
import { parseString, stringifyObject } from "../jsonHelper";
import dayjs from "dayjs";

function AddVendorPurchase() {
  let { slug } = useParams();
  let user = getUser();
  const [products, setProducts] = useState([]);
  const [billProducts, setBillProducts] = useState({});
  const [date,setDate]=useState(dayjs());

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic
    let ind = 0;
    let purchases = [];
    while (billProducts[ind]) {
      if (billProducts[ind] && billProducts[ind].productId) {
        let temp = {
          vendorId: slug,
          productId: billProducts[ind].productId,
          productName: billProducts[ind].productName,
          quantity: billProducts[ind].quantity,
          amount: billProducts[ind].totalValue,
          user,
          date: new Date(date),
        };
        console.log(temp)
        purchases.push(temp);
      }
      ind++;
    }
    let res = await createVendorBill(
      stringifyObject({
        purchases,
        date: getLocaleDate(new Date()),
        vendorId: slug,
        user,
      })
    );

    res = parseString(res);
    console.log(res,"vendor purchase")
    if (res.status === 200) {
      setBillProducts({});
      message.success("Bill Created Successfully");
    //   navigate.push(`/bills/${res.data._id}`);
    } else {
      console.error("Error creating bill:", res.error);
    }
  };

  const getProducts = async (user) => {
    const temp = await getProductsForUser(user);
    setProducts(temp);
  };

  const handleBillProductDelete = (index) => {
    setBillProducts((prev) => {
      let temp = {};
      let ind = 0;
      for (let i in prev) {
        if (i !== index) {
          temp[ind] = prev[i];
          ind++;
        }
      }
      return temp;
    });
  };

  const handleSelectChange = (index, value,product) => {
    console.log(product.label)
    setBillProducts((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        productId: value,
        productName: product.label,
      },
    }));
  };

  const handleInputChange = (index, field, value) => {
    setBillProducts((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    getProducts(user);
  }, [user]);

  return (
    <div>
      <h3>Date:</h3>
      <DatePicker onChange={(date,dateStr)=>setDate(dayjs(new Date(dateStr)))} value={date} />
      <h3>Products Purchases</h3>
      {Object.keys(billProducts).map((index) => (
        <div key={index} className="product-component">
          <label>
            Product Name:
            <Select
              onChange={(value,label) => handleSelectChange(index, value,label)}
              style={{ width: "100%" }}
              options={products.map((product) => ({
                value: product._id,
                label: product.productName,
              }))}
              value={billProducts[index]?.productId || ""}
            />
          </label>
          <label>
            Quantity:
            <Input
              type="number"
              placeholder="Enter Quantity"
              onChange={(e) =>
                handleInputChange(index, "quantity", e.target.value)
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
                handleInputChange(
                  index,
                  "totalValue",
                  e.target.value
                )
              }
              value={billProducts[index]?.totalValue || ""}
            />
          </label>
          <br />
          <br />
          <Button
            type="primary"
            danger
            onClick={() => handleBillProductDelete(index)}
          >
            Delete Product
          </Button>
        </div>
      ))}
      <Button
        onClick={() => {
          const newIndex = Object.keys(billProducts).length;
          setBillProducts((prev) => ({
            ...prev,
            [newIndex]: { productId: "", quantity: 0, totalValue: 0 },
          }));
        }}
        type="primary"
      >
        Add Product
      </Button>
      <br />
      <br />
      <Button onClick={handleSubmit} type="primary">
        Submit
      </Button>
    </div>
  );
}

export default AddVendorPurchase;
