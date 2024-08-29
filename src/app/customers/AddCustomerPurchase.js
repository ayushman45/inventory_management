import React, { useEffect, useState } from "react";
import { Button, Select, Input, message } from "antd";
import { getUser } from "../helper/token";
import { getProductsForUser, getServicesForUser } from "../helper/getProducts";
import { useParams } from "next/navigation";
import { getISODateString, getLocaleDate } from "../helper/date";
import { createBill } from "../api/handlers/handleCustomerPurchase";
import { parseString, stringifyObject } from "../jsonHelper";
import { useRouter } from "next/navigation";

function AddCustomerPurchase() {
  const navigate = useRouter();
  const [products, setProducts] = useState([]);
  const [billProducts, setBillProducts] = useState({});
  const [services, setServices] = useState([]);
  const [billServices, setBillServices] = useState({});

  const user = getUser();
  const { slug } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic
    let ind =0;
  let purchases=[]
  while(billProducts[ind] ||billServices[ind]){
    if(billProducts[ind] && billProducts[ind].productId){
      let temp={
        customerId:slug,
        productId: billProducts[ind].productId,
        description:billProducts[ind].productName,
        purchaseType:"product",
        quantity: billProducts[ind].quantity,
        totalValue: billProducts[ind].totalValue,
        user,
        date: getLocaleDate(new Date())

      }
      purchases.push(temp)
    }
    if(billServices[ind] && billServices[ind].serviceId){
      let temp={
        customerId:slug,
        description:billServices[ind].serviceName,
        serviceId: billServices[ind].serviceId,
        purchaseType:"service",
        totalValue: billServices[ind].totalValue,
        user,
        date: getLocaleDate(new Date())

      }
      purchases.push(temp)
    }
    ind++;
    
  }
    let res = await createBill(stringifyObject({
      purchases,
      date: getLocaleDate(new Date()),
      customerId:slug,
      user,
    }));

    res = parseString(res);
    if (res.status === 200) {
      setBillProducts({});
      setBillServices({});
      message.success("Bill Created Successfully");
      navigate.push(`/bills/${res.data._id}`);

    } else {
      console.error("Error creating bill:", res.error);

    }

  };

  const getProducts = async (user) => {
    const temp = await getProductsForUser(user);
    setProducts(temp);
  };

  const getServices = async (user) => {
    const temp = await getServicesForUser(user);
    setServices(temp);
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

  const handleBillServiceDelete = (index) => {
    setBillServices((prev) => {
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

  const handleSelectChange = (index, product, type) => {
    if (type === "product") {
      setBillProducts((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          productId: product.value,
          productName: product.label
        },
      }));
    } else {
      setBillServices((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          serviceId: product.value,
          serviceName: product.label,
        },
      }));
    }
  };

  const handleInputChange = (index, field, value, type) => {
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

  useEffect(() => {
    getProducts(user);
    getServices(user);
  }, [user]);

  return (
    <div className="form">
      <h3>Products Purchases</h3>
      {Object.keys(billProducts).map((index) => (
        <div key={index} className="product-component">
          <label>
            Product Name:
            <Select
              onChange={(value,product) => handleSelectChange(index, product, "product")}
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
                handleInputChange(
                  index,
                  "totalValue",
                  e.target.value,
                  "product"
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

      <hr />

      <h3>Service Purchases</h3>
      {Object.keys(billServices).map((index) => (
        <div key={index} className="product-component">
          <label>
            Service Name:
            <Select
              onChange={(value,product) => handleSelectChange(index, product, "service")}
              style={{ width: "100%" }}
              options={services.map((service) => ({
                value: service._id,
                label: service.serviceName,
              }))}
              value={billServices[index]?.serviceId || ""}
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
                  e.target.value,
                  "service"
                )
              }
              value={billServices[index]?.totalValue || ""}
            />
          </label>
          <br />
          <br />
          <Button
            type="primary"
            danger
            onClick={() => handleBillServiceDelete(index)}
          >
            Delete Service
          </Button>
        </div>
      ))}
      <Button
        onClick={() => {
          const newIndex = Object.keys(billServices).length;
          setBillServices((prev) => ({
            ...prev,
            [newIndex]: { serviceId: "", totalValue: 0 },
          }));
        }}
        type="primary"
      >
        Add Service
      </Button>
      <br />
      <br />

      <Button onClick={handleSubmit} type="primary">
        Submit
      </Button>
    </div>
  );
}

export default AddCustomerPurchase;
