"use client";
import {
  createOrUpdateProduct,
  getProduct,
} from "@/app/api/handlers/handleProducts";
import { getUser } from "@/helper/token";
import { parseString, stringifyObject } from "@/app/jsonHelper";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, message, Tabs, Typography } from "antd";
import { getLocaleDate } from "@/helper/date";
import Header from "@/Components/Header";
import axios from "axios";

const { Title, Paragraph, Text } = Typography;

function EditProduct({ product, getProductForUser }) {
  const [productName, setProductName] = useState(product.productName);
  const [company, setCompany] = useState(product.company);
  const [description, setDescription] = useState(product.description)

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedProduct = {
      ...product,
      _id: product._id,
      productName,
      company,
      description,
    };

    console.log(updatedProduct);
    let res = await createOrUpdateProduct(
      stringifyObject({ ...updatedProduct })
    );
    console.log(parseString(res));
    if (parseString(res).status === 200) {
      getProductForUser();
      message.success("Product Updated Successfully");
    } else {
      message.error("Failed to update product");
    }
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <label>Product Name</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <label>Company</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <label>Product Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

function Product() {
  const { slug } = useParams();
  const [user,setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());

  }, []);

  const [product, setProduct] = useState(null);
  const [tabItems, setTabItems] = useState(null);
  const navigate = useRouter();

  const getProductForUser = async () => {
    let res = await getProduct(stringifyObject({ user, id: slug }));
    console.log(parseString(res));
    if (parseString(res).status === 200) {
      let data = JSON.parse(res).data;
      setProduct(data);
    }
  };

  const handleDeleteProduct = async () => {
    let res = await axios.get(`/api/products/delete/${slug}`);
    if(res.status === 200){
      message.success("Product Deleted Successfully");
      navigate.push("/products");
    }

  }

  const onChange = (key) => {
    console.log(key);
  };

  useEffect(() => {
    if (!product) {
      return;
    }

    let jsx = (
      <div>
        <Title>{product.productName}</Title>
        <Paragraph>
          <Text strong>Company:</Text> {product.company}
        </Paragraph>
        <Paragraph>
          <Text strong>Product Description:</Text> {product.description}
        </Paragraph>
      </div>
    );

    const items = [
      {
        key: "1",
        label: "Product Data",
        children: jsx,
      },
      {
        key: "2",
        label: "Edit",
        children: <EditProduct product={product} getProductForUser={getProductForUser} />,
      },
      {
        key: "3",
        label: "Delete",
        children: <div>
        <Button type="primary" danger onClick={handleDeleteProduct}>Delete Product</Button>
      </div>,
      },
    ];

    setTabItems(items);

  }, [product]);

  useEffect(() => {
    if (!slug || !user) {
      return;
    }

    getProductForUser();
  }, [slug, user]);
  return (
    <div>
      <Header />
      <br />
      {product && (
        <Tabs defaultActiveKey="1" items={tabItems} onChange={onChange} />
      )}
      {!product && <Title>Loading...</Title>}
    </div>
  );
}

export default Product;
