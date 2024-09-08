"use client";

import React, { useEffect } from "react";
import { getToken, getUser } from "../helper/token";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import ExpenseAnalytics from "../Components/ExpenseAnalytics";
import Header from "@/app/Components/Header";

function Dashboard() {
  const navigate = useRouter();

  useEffect(() => {
    let token = getToken();
    if (!token) {
      navigate.push("/login");
    }
  }, []);

  return (
    <div className="col-flex wid-100">
      <Header />
      <br />
      <br />
      <div className="row-flex wid-100" style={{ justifyContent: "center" }}>
        <div className="row-flex " style={{ gap: "20px", flexWrap: "wrap" }}>
          <Button type="primary" onClick={() => navigate.push("/customers")}>
            Customers
          </Button>
          <Button type="primary" onClick={() => navigate.push("/vendors")}>
            Vendors
          </Button>
          <Button type="primary" onClick={() => navigate.push("/services")}>
            Services
          </Button>
          <Button type="primary" onClick={() => navigate.push("/products")}>
            Products
          </Button>
          <Button type="primary" onClick={() => navigate.push("/expenses")}>
            Expenses
          </Button>
        </div>
      </div>
      <br />
      <div>
        <ExpenseAnalytics />
      </div>
    </div>
  );
}

export default Dashboard;
