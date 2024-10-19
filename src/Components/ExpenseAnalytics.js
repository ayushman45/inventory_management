"use client";

import React, { useEffect, useState } from "react";
import { DatePicker, Select } from "antd";
import { getUser } from "../helper/token";
import { convertAmountAddCommas } from "../helper/amount";
import axios from "axios";
const { RangePicker } = DatePicker;

const dayjs = require("dayjs");

function DateInput({ mode, setDates,startDate,endDate }) {
    if(!mode || !startDate || !endDate) {
        return <></>
    }

  switch (mode) {
    case "daily":
      return (
        <DatePicker
            value={dayjs(startDate)}
          onChange={(value, dateString) =>
            setDates({ value, dateString, type: "single" })
          }
        />
      );
    case "week":
      return (
        <DatePicker
         value={dayjs(startDate)}
          picker="week"
          onChange={(value, dateString) =>
            setDates({ value, dateString, type: "single" })
          }
        />
      );
    case "monthly":
      return (
        <DatePicker
         value={dayjs(startDate)}
          picker="month"
          onChange={(value, dateString) =>
            setDates({ value, dateString, type: "single" })
          }
        />
      );
    case "quarterly":
      return (
        <DatePicker
         value={dayjs(startDate)}
          picker="quarter"
          onChange={(value, dateString) =>
            setDates({ value, dateString, type: "single" })
          }
        />
      );
    case "yearly":
      return (
        <DatePicker
            value={dayjs(startDate)}
          picker="year"
          onChange={(value, dateString) =>
            setDates({ value, dateString, type: "single" })
          }
        />
      );
    case "custom":
      return (
        <RangePicker
            value={[dayjs(startDate),dayjs(endDate)]}
          onChange={(value, dateArr) =>
            setDates({ value, dateArr, type: "range" })
          }
        />
      );
    default:
      return (
        <DatePicker
            value={dayjs(startDate)}
          onChange={(value, dateString) =>
            setDates({ value, dateString, type: "single" })
          }
        />
      );
  }
}

function ExpenseAnalytics() {
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [incomeAmount, setIncomeAmount] = useState(0);
  const [mode, setMode] = useState("monthly");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [user, setUser] = useState(null);

  const setDates = ({value, dateString,dateArr, type}) => {
    if (type === "single") {
        if(mode==="monthly"){
            setStartDate(dayjs(dateString).startOf("month").toISOString());
            setEndDate(dayjs(dateString).endOf("month").toISOString());
        }
        else if(mode==="yearly"){
            setStartDate(dayjs(dateString).startOf("year").toISOString());
            setEndDate(dayjs(dateString).endOf("year").toISOString());
        }
        else if(mode==="quarterly"){
            let quarter = dateString.split("-")[1];
            let year = dateString.split("-")[0];
            switch(quarter){
                case "Q1":
                    setStartDate(dayjs(`${year}-01-01`).toISOString());
                    setEndDate(dayjs(`${year}-03-31`).toISOString());
                    break;
                case "Q2":
                    setStartDate(dayjs(`${year}-04-01`).toISOString());
                    setEndDate(dayjs(`${year}-06-30`).toISOString());
                    break;
                case "Q3":
                    setStartDate(dayjs(`${year}-07-01`).toISOString());
                    setEndDate(dayjs(`${year}-09-30`).toISOString());
                    break;
                case "Q4":
                    setStartDate(dayjs(`${year}-10-01`).toISOString());
                    setEndDate(dayjs(`${year}-12-31`).toISOString());
                    break;
                default:
                    let quarter = Math.floor((dayjs(dateString).month() + 2) / 3);
                    setStartDate(dayjs(`${dayjs(dateString).year()}-${quarter * 3 - 2}-01`).toISOString());
                    setEndDate(dayjs(`${dayjs(dateString).year()}-${quarter * 3}-31`).toISOString());
                    break;
            }
        }
        else if(mode==="daily"){
            setStartDate(dayjs(dateString).toISOString());
            setEndDate(dayjs(dateString).toISOString());
        }
        else if(mode==="weekly"){
            setStartDate(dayjs(dateString).startOf("week").toISOString());
            setEndDate(dayjs(dateString).endOf("week").toISOString());
        }
        else{
            setStartDate(dateString);
            setEndDate(dateString);
        }
    } else if (type === "range") {
      if(mode==="quarterly"){
        setStartDate(dayjs(dateArr[0]).startOf("quarter").toISOString());
        setEndDate(dayjs(dateArr[1]).endOf("quarter").toISOString());
      }
    }
  };

  const getAnalyticsHelper = async () => {
    if (!user) {
      return;
    }

    let res = await axios.get('/api/analytics?startDate='+startDate+'&endDate='+endDate+'&user='+user);
    if (res.status === 200) {
      setExpenseAmount(res.data.debits);
      setIncomeAmount(res.data.credits);
    } else {
      setExpenseAmount(0);
      setIncomeAmount(0);
    }
  };

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    switch (mode) {
      case "daily":
        setStartDate(dayjs().startOf("day").toISOString());
        setEndDate(dayjs().endOf("day").toISOString());
        break;
      case "week":
        setStartDate(dayjs().subtract(6, "days").startOf("day").toISOString());
        setEndDate(dayjs().endOf("day").toISOString());
        break;
      case "monthly":
        setStartDate(dayjs().startOf("month").toISOString());
        setEndDate(dayjs().endOf("month").toISOString());
        break;
      case "quarterly":
        let quarterStart = dayjs().startOf("quarter").toISOString();
        let quarterEnd = dayjs().endOf("quarter").toISOString();
        setStartDate(quarterStart);
        setEndDate(quarterEnd);
        break;
      case "yearly":
        setStartDate(dayjs().startOf("year").toISOString());
        setEndDate(dayjs().endOf("year").toISOString());
        break;
      default:
        setStartDate(dayjs().startOf("day").toISOString());
        setEndDate(dayjs().endOf("day").toISOString());
        break;
    }
  }, [mode]);

  useEffect(() => {
    // Fetch data based on selected mode, start date, and end date
    getAnalyticsHelper();
  }, [mode,startDate, endDate]);

  return (
    <div className="expense-analytics-container">
      <div className="row-flex wid-100" style={{gap:"50px",marginBottom:"20px"}}>
        <div className="row-flex" style={{ gap: "50px",marginLeft:"50px" }}>
          <label>
            Select Range:
            <br />
            <br />
            <DateInput mode={mode} setDates={setDates} startDate={startDate} endDate={endDate} />
          </label>
        </div>
        <div>
          <label>
            Filter:
            <br />
            <br />
            <Select
              defaultValue="monthly"
              style={{ width: 120 }}
              onChange={(value) => {
                setMode(value);
              }}
            >
              <Select.Option value="daily">Daily</Select.Option>
              <Select.Option value="week">Week</Select.Option>
              <Select.Option value="monthly">Monthly</Select.Option>
              <Select.Option value="quarterly">Quarterly</Select.Option>
              <Select.Option value="yearly">Yearly</Select.Option>
              <Select.Option value="custom">Custom</Select.Option>
            </Select>
          </label>
        </div>
      </div>
      <br />
      <div className="row-flex wid-100" style={{gap:"50px",justifyContent:"center"}}>
        <div id="cash-in" style={{ width: "200px" }}>
            <p>Cash In</p>
            <p className="amount-p">₹{convertAmountAddCommas(Math.round(incomeAmount))}</p>
        </div>
        <div id="cash-out" style={{ width: "200px" }}>
            <p>Cash Out</p>
            <p className="amount-p">₹{convertAmountAddCommas(Math.round(expenseAmount))}</p>
        </div>
      </div>
    </div>
  );
}

export default ExpenseAnalytics;
