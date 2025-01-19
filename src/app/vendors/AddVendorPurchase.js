"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { getUser } from "../../helper/token";
import { getProductsForUser } from "../../helper/getProducts";
import { Button, DatePicker, Input, message, Select } from "antd";
import { getLocaleDate } from "../../helper/date";
import { createVendorBill } from "../api/handlers/handleVendorPurchase";
import { parseString, stringifyObject } from "../jsonHelper";
import dayjs from "dayjs";
import Papa from "papaparse";

function AddVendorPurchase() {
  let { slug } = useParams();
  let user = getUser();
  const [products, setProducts] = useState([]);
  const [billProducts, setBillProducts] = useState({});
  const [date, setDate] = useState(dayjs(new Date(Date.now())));
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [invoice, setInvoice] = useState("");
  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const navigate = useRouter();

  const handleImportProducts = () => {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (e) => {
      let file = e.target.files[0];
      Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
          //dwst verify headers
          let vendorPurchases = results.data;
          let purchasesImported = [];

          vendorPurchases.forEach((product, index) => {
            //get product id from products arr
            let productId =
              products.find(
                (p) => p.productName.trim() === product.productName.trim()
              )?._id || null;
            if (productId) {
              product.productId = productId;
            } else {
              console.log(product.productName, "not found");
            }

            //add to billProducts

            purchasesImported.push({
              productId: product.productId,
              productName: product.productName.trim(),
              quantity: parseInt(product.quantity),
              totalValue: parseFloat(product.amount),
            });
          });

          setBillProducts(purchasesImported);
        },
      });
    };
    input.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic
    setLoadingBtn(true);
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
        purchases.push(temp);
      }
      ind++;
    }

    let res = await createVendorBill(
      stringifyObject({
        purchases,
        date: new Date(date),
        vendorId: slug,
        invoice,
        cgst,
        sgst,
        user,
      })
    );
    res = parseString(res);
    if (res.status === 200) {
      setBillProducts({});
      message.success("Bill Created Successfully");
      navigate.push(`/vendorbills/${res.data._id}`);
    } else {
      console.error("Error creating bill:", res.error);
    }
    setLoadingBtn(false);
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

  const handleDownloadProducts = (jsonObject) => {
    let fileName = "products.csv";
    const csvHeader = Object.keys(jsonObject[0]).join(",") + "\n";
    const csvRows = jsonObject
      .map((row) => {
        return Object.values(row)
          .map((value) => {
            // Handle commas and quotes in values
            if (typeof value === "string" && value.includes(",")) {
              return `"${value}"`;
            }
            return value;
          })
          .join(",");
      })
      .join("\n");

    const csvString = csvHeader + csvRows;
    const blob = new Blob([csvString], { type: "text/csv" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectChange = (index, product) => {
    setBillProducts((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        productId: product.id,
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
      <DatePicker
        onChange={(date, dateStr) => setDate(dayjs(new Date(dateStr)))}
        value={date}
      />
      <h3>Invoice Id : </h3>
      <Input
        onChange={(e) => setInvoice(e.target.value)}
        style={{ width: "405px" }}
        value={invoice}
      />
      <h3>Products Purchases</h3>
      {Object.keys(billProducts).map((index) => (
        <div key={index} className="product-component">
          <label>
            Product Name:
            <Select
              showSearch
              onChange={(value, product) => handleSelectChange(index, product)}
              style={{ width: "200px" }}
              options={products.map((product) => ({
                value: product.productName + product._id,
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
                handleInputChange(index, "quantity", e.target.value)
              }
              value={billProducts[index]?.quantity || ""}
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
                handleInputChange(index, "totalValue", e.target.value)
              }
              value={billProducts[index]?.totalValue || ""}
              style={{ width: "150px" }}
              min={0}
            />
          </label>
          <br />
          <br />
          <Button
            type="primary"
            danger
            onClick={() => handleBillProductDelete(index)}
            style={{ width: "10%" }}
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
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        <Button onClick={handleImportProducts} type="primary">
          Import Products
        </Button>
        <Button onClick={() => handleDownloadProducts(products)} type="primary">
          Get Products
        </Button>
      </div>
      <br />
      <br />
      <label>CGST(in %):</label>
      <br />
      <Input
        type="Number"
        onChange={(e) => setCgst(e.currentTarget.value)}
        style={{ width: "200px" }}
      />

      <br />
      <br />

      <label>SGST(in %):</label>
      <br />
      <Input
        type="Number"
        onChange={(e) => setSgst(e.currentTarget.value)}
        style={{ width: "200px" }}
      />

      <br />
      <br />

      <Button onClick={handleSubmit} type="primary" loading={loadingBtn}>
        Submit
      </Button>
    </div>
  );
}

export default AddVendorPurchase;
