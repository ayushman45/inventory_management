import React, { useEffect, useState } from "react";
import { Button, Select, Input } from "antd";
import { getUser } from "../helper/token";
import { getProductsForUser } from "../helper/getProducts";
import { useParams } from "next/navigation";

function AddCustomerPurchase({ onClose }) {
  const [products, setProducts] = useState([]);
  const [billProducts, setBillProducts] = useState({});
  const [services,setServices] = useState([]);
  const [billServices, setBillServices] = useState({});

  const user = getUser();
  const { slug } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log("Form submitted with: ", billProducts);
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

  const handleSelectChange = (index, value) => {
    setBillProducts((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        productId: value,
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
    <div className="form">
      <h3>Products Purchases</h3>
      {Object.keys(billProducts).map((index) => (
        <div key={index} className="product-component">
          <label>
            Product Name:
            <Select
              onChange={(value) => handleSelectChange(index, value)}
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
                handleInputChange(index, "totalValue", e.target.value)
              }
              value={billProducts[index]?.totalValue || ""}
            />
          </label>
          <br />
          <br />
          <Button type="primary" danger onClick={() => handleBillProductDelete(index)}>
            Delete Product
          </Button>
        </div>
      ))}
      <Button
        onClick={() =>
          {
            const newIndex = Object.keys(billProducts).length;
            setBillProducts((prev) => ({
              ...prev,
              [newIndex]: { productId: "", quantity: 0, totalValue: 0 },
            }));
          }
        }
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
              onChange={(value) => handleSelectChange(index, value)}
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
                handleInputChange(index, "totalValue", e.target.value)
              }
              value={billServices[index]?.totalValue || ""}
            />
          </label>
          <br />
          <br />
          <Button type="primary" danger onClick={() => handleBillProductDelete(index)}>
            Delete Product
          </Button>
        </div>
      ))}
      <Button
        onClick={() =>
          {
            const newIndex = Object.keys(billProducts).length;
            setBillProducts((prev) => ({
              ...prev,
              [newIndex]: { productId: "", quantity: 0, totalValue: 0 },
            }));
          }
        }
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

export default AddCustomerPurchase;
