"use client";

import { Button, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import ModalHelper from "../Components/ModalHelper";
import NewProduct from "./NewProduct";
import { getProductsForUser } from "../helper/getProducts";
import { getUser } from "../helper/token";
import { importProductsFromCSV } from "../api/handlers/productHandler";
import { parseString, stringifyObject } from "../jsonHelper";
import Papa from "papaparse";
import Searchbar from "../Components/Searchbar";
import { useRouter } from "next/navigation";
import { config } from "../config";

function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState(null);
  const user = getUser();
  const navigate = useRouter();

  const fetchProducts = async () => {
    let products = await getProductsForUser(user);
    setProducts(products);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
        title:"Quantity",
        dataIndex: "quantity",
        key: "quantity",
    }
  ];

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
          let res = await importProductsFromCSV(
            stringifyObject({ user, data: results.data })
          );
          let response = parseString(res);
          if (response.status === 200) {
            message.success("Products Imported Successfully");
            fetchProducts();
          } else {
            message.error("Failed to import products");
          }
        },
      });
    };
    input.click();
  };

  const handleSearch = (id) => {
    navigate.push(`/products/${id}`);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchProducts();
  }, [user]);

  return (
    <div>
      <div className="row-flex wid-100 sp-between">
        <div className="row-flex wid-50 sp-between">
        {products && (
        <Searchbar
          arrOfObj={products}
          displayField={"productName"}
          onClickHandler={handleSearch}
        />
      )}
        </div>
      <div className="row-flex wid-50 flex-end" style={{gap:"10px"}}>
        <Button type="primary" onClick={() => setIsModalOpen((prev) => !prev)}>
          Add New Product
        </Button>
        <Button type="primary" onClick={handleImportProducts}>
          Import Products
        </Button>
      </div>
      </div>

      <br />

      <ModalHelper
        ViewComponent={NewProduct}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      {products?.length > 0 && (
        <Table 
        dataSource={products} 
        columns={columns} 
        rowKey={'_id'}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {navigate.push(`/products/${record._id}`)},
          }}}
        />
      )}

      <br />

     </div>
  );
}

export default Products;
