"use client";

import React, { useEffect, useState } from "react";
import { getInvUser, getToken, getUser } from "../../helper/token";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import ExpenseAnalytics from "../../Components/ExpenseAnalytics";
import Header from "@/Components/Header";

function Dashboard() {
  const navigate = useRouter();
  const [user,setUser] = useState(null);

  useEffect(() => {
    let token = getToken();
    if (!token) {
      navigate.push("/login");

    }

  }, []);

  useEffect(() => {
    setUser(getInvUser());

  }, []);

  useEffect(()=>{
    console.log(user);
  },[user])

  if(!user){
    return <></>
  }

  return (
    <div className="col-flex wid-100">
      <Header user={user} />
      <br />
      <br />
      <div className="row-flex wid-100" style={{ justifyContent: "center" }}>
        <div className="row-flex " style={{ gap: "20px", flexWrap: "wrap" }}>
        {
            !user?.academyEnabled &&
          <Button type="primary" onClick={() => navigate.push("/customers")}>
            Customers
          </Button>
}
          <Button type="primary" onClick={() => navigate.push("/vendors")}>
            Vendors
          </Button>
          {
            !user?.academyEnabled &&
          <Button type="primary" onClick={() => navigate.push("/services")}>
            Services
          </Button>
}
          <Button type="primary" onClick={() => navigate.push("/products")}>
            Products
          </Button>
          <Button type="primary" onClick={() => navigate.push("/expenses")}>
            Expenses
          </Button>
          {
            user?.academyEnabled &&
            <Button type="primary" onClick={() => navigate.push("/students")}>
            Students
          </Button>
          }
           {
            user?.academyEnabled &&
            <Button type="primary" onClick={() => navigate.push("/courses")}>
            Courses
          </Button>
          }
           {
            user?.academyEnabled &&
            <Button type="primary" onClick={() => navigate.push("/batches")}>
            Batches
          </Button>
          }
        </div>
      </div>
      <br />
      <div>
        <ExpenseAnalytics user={user}/>
      </div>
    </div>
  );
}

export default Dashboard;
