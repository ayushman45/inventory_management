import React, { useEffect, useState } from "react";
import { Button, Select, Input, message, DatePicker } from "antd";
import { getUser } from "../../helper/token";
import {
  getProductsForUser,
  getServicesForUser,
} from "../../helper/getProducts";
import { useParams } from "next/navigation";
import { createBill } from "../api/handlers/handleStudentPurchase";
import { parseString, stringifyObject } from "../jsonHelper";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

function AddStudentPurchase() {
  const navigate = useRouter();
  const [products, setProducts] = useState([]);
  const [billProducts, setBillProducts] = useState({});
  const [services, setServices] = useState([]);
  const [billServices, setBillServices] = useState({});
  const [date, setDate] = useState(dayjs());
  const [loadingBtn, setLoadingBtn] = useState(false);

  const user = getUser();
  const { slug } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic
    setLoadingBtn(true);
    let ind = 0;
    let purchases = [];
    while (billProducts[ind] || billServices[ind]) {
      if (billProducts[ind] && billProducts[ind].productId) {
        let temp = {
          studentId: slug,
          productId: billProducts[ind].productId,
          description: billProducts[ind].productName,
          purchaseType: "product",
          discount: billProducts[ind].discount || 0,
          totalValue:
            billProducts[ind].totalValue *
            (1 - (billProducts[ind].discount||0) / 100),
          quantity: billProducts[ind].quantity,
          user,
          date: new Date(date),
        };
        purchases.push(temp);
      }
      if (billServices[ind] && billServices[ind].serviceId) {
        let temp = {
          studentId: slug,
          description: billServices[ind].serviceName,
          serviceId: billServices[ind].serviceId,
          purchaseType: "service",
          discount: billServices[ind].discount||0,
          totalValue:
            billServices[ind].totalValue *
            (1 - (billServices[ind].discount||0) / 100),
          user,
          date: new Date(date),
        };
        purchases.push(temp);
      }
      ind++;
    }
    console.log({
      purchases,
      date: new Date(date),
      studentId: slug,
      user,
    })
    let res = await createBill(
      stringifyObject({
        purchases,
        date: new Date(date),
        studentId: slug,
        user,
      })
    );

    res = parseString(res);
    if (res.status === 200) {
      setBillProducts({});
      setBillServices({});
      message.success("Bill Created Successfully");
      navigate.push(`/studentbills/${res.data._id}`);
    } else {
      console.error("Error creating bill:", res.error);
    }

    setLoadingBtn(true);
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
          productId: product.id,
          productName: product.label,
        },
      }));
    } else {
      setBillServices((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          serviceId: product.id,
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
      <h3>Date</h3>
      <DatePicker
        onChange={(date, dateStr) => setDate(dayjs(new Date(dateStr)))}
        value={date}
      />
      <h3>Products Purchases</h3>
      {Object.keys(billProducts).map((index) => (
        <div key={index} className="product-component">
          <label>
            Product Name:
            <Select
              showSearch
              onChange={(value, product) =>
                handleSelectChange(index, product, "product")
              }
              style={{ width: "200px" }}
              options={products.map((product) => ({
                value: product.productName+product._id,
                label: product.productName,
                id: product._id,
              }))}
              value={billProducts[index]?.productName || ""}
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
              value={billProducts[index]?.quantity || 0}
              style={{ width: "75px" }}
              min={0}
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
              value={billProducts[index]?.totalValue || 0}
              style={{ width: "175px" }}
              min={0}
            />
          </label>
          <label>
            Discount(in%):
            <Input
              type="number"
              min={0}
              max={100}
              placeholder="Enter Price"
              onChange={(e) =>
                handleInputChange(index, "discount", e.target.value, "product")
              }
              value={billProducts[index]?.discount || 0}
              style={{ width: "75px" }}
            />
          </label>
          <label>
            Total Value after Discount:
            <Input
              type="number"
              placeholder="Enter Price"
              value={
                billProducts[index]?.discount
                  ? billProducts[index]?.totalValue *
                    (1 - billProducts[index]?.discount / 100)
                  : billProducts[index]?.totalValue
              }
              disabled
              style={{ width: "175px" }}
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

      <Button onClick={handleSubmit} type="primary" loading={loadingBtn}>
        Submit
      </Button>
    </div>
  );
}

export default AddStudentPurchase;
