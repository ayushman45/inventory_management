"use client";

import React, { useEffect, useState } from "react";
import { DatePicker, Select, Table } from "antd";
import { getUser } from "../helper/token";
import { convertAmountAddCommas } from "../helper/amount";
import axios from "axios";
import { VendorDebit } from "@/backendHelpers/models/vendorDebit";
import { FallOutlined, RiseOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;

const dayjs = require("dayjs");

function DateInput({ mode, setDates, startDate, endDate }) {
  if (!mode || !startDate || !endDate) {
    return <></>;
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
          value={[dayjs(startDate), dayjs(endDate)]}
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

function DataRow({ data }) {
  return (
    <div
      className={`data-row data-row-${data.type || "neutral"}`}
      key={data.id}
    >
      <div>{data.type === "in" ? <RiseOutlined /> : <FallOutlined />}</div>
      <div>{data.amount}</div>
      <div>{data.note}</div>
      <div>{dayjs(data.date).toISOString().slice(0, 10)}</div>
    </div>
  );
}

function ExpenseAnalytics(props) {
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [incomeAmount, setIncomeAmount] = useState(0);
  const [mode, setMode] = useState("daily");
  const [startDate, setStartDate] = useState(dayjs().startOf("day").toDate());
  const [endDate, setEndDate] = useState(dayjs().endOf("day").toDate());
  const [allData, setAllData] = useState(null);

  const setDates = ({ value, dateString, dateArr, type }) => {
    if (type === "single") {
      if (mode === "monthly") {
        setStartDate(dayjs(dateString).startOf("month").toDate());
        setEndDate(dayjs(dateString).endOf("month").toDate());
      } else if (mode === "yearly") {
        setStartDate(dayjs(dateString).startOf("year").toDate());
        setEndDate(dayjs(dateString).endOf("year").toDate());
      } else if (mode === "quarterly") {
        let quarter = dateString.split("-")[1];
        let year = dateString.split("-")[0];
        switch (quarter) {
          case "Q1":
            setStartDate(dayjs(`${year}-01-01`).toDate());
            setEndDate(dayjs(`${year}-03-31`).toDate());
            break;
          case "Q2":
            setStartDate(dayjs(`${year}-04-01`).toDate());
            setEndDate(dayjs(`${year}-06-30`).toDate());
            break;
          case "Q3":
            setStartDate(dayjs(`${year}-07-01`).toDate());
            setEndDate(dayjs(`${year}-09-30`).toDate());
            break;
          case "Q4":
            setStartDate(dayjs(`${year}-10-01`).toDate());
            setEndDate(dayjs(`${year}-12-31`).toDate());
            break;
          default:
            let quarter = Math.floor((dayjs(dateString).month() + 2) / 3);
            setStartDate(
              dayjs(
                `${dayjs(dateString).year()}-${quarter * 3 - 2}-01`
              ).toDate()
            );
            setEndDate(
              dayjs(`${dayjs(dateString).year()}-${quarter * 3}-31`).toDate()
            );
            break;
        }
      } else if (mode === "daily") {
        setStartDate(dayjs(dateString).toDate());
        setEndDate(dayjs(dateString).toDate());
      } else if (mode === "weekly") {
        setStartDate(dayjs(dateString).startOf("week").toDate());
        setEndDate(dayjs(dateString).endOf("week").toDate());
      } else {
        setStartDate(dateString);
        setEndDate(dateString);
      }
    } else if (type === "range") {
      if (mode === "quarterly") {
        setStartDate(dayjs(dateArr[0]).startOf("quarter").toDate());
        setEndDate(dayjs(dateArr[1]).endOf("quarter").toDate());
      }
    }
  };

  const convertDataToTable = (data) => {
    console.log(data);
    let { expenses, fees, incomes, vendorDebits } = data;
    let temp = [];
    expenses &&
      expenses.map((exp) => {
        temp.push({
          url: `/expenses/${exp._id}`,
          amount: exp.amount,
          type: "out",
          note: exp.description,
          date: exp.date,
        });
      });

    fees &&
      fees.map((fee) => {
        temp.push({
          url: `/fees/${fee._id}`,
          amount: fee.amount,
          type: "in",
          note: "Fees Deposit By Student",
          date: fee.date,
        });
      });

    incomes &&
      incomes.map((income) => {
        temp.push({
          url: `/income/${income._id}`,
          amount: income.amount,
          type: "in",
          note: "Bill Payment by Customer",
          date: income.date,
        });

        vendorDebits &&
          vendorDebits.map((vendord) => {
            temp.push({
              url: `/vendorbills/${vendord._id}`,
              amount: vendord.amount,
              type: "out",
              note: "Bill Payment to Vendor",
              date: vendord.date,
            });
          });
      });

    temp.sort((a, b) => new Date(a.date) - new Date(b.date));

    setAllData(temp);
    console.log({temp})
  };

  const getAnalyticsHelper = async () => {
    if (!props.user.username) {
      return;
    }

    let res = await axios.post("/api/analytics?&user=" + props.user.username, {
      startDate,
      endDate,
    });
    if (res.status === 200) {
      setExpenseAmount(res.data.debits);
      setIncomeAmount(res.data.credits);
      convertDataToTable(JSON.parse(res.data.allData));
    } else {
      setExpenseAmount(0);
      setIncomeAmount(0);
      setAllData(null);
    }
  };

  useEffect(() => {
    if (!mode) {
      return;
    }
    switch (mode) {
      case "daily":
        setStartDate(dayjs().startOf("day").toDate());
        setEndDate(dayjs().endOf("day").toDate());
        break;
      case "week":
        setStartDate(dayjs().subtract(6, "days").startOf("day").toDate());
        setEndDate(dayjs().endOf("day").toDate());
        break;
      case "monthly":
        setStartDate(dayjs().startOf("month").toDate());
        setEndDate(dayjs().endOf("month").toDate());
        break;
      case "quarterly":
        let quarterStart = dayjs().startOf("quarter").toDate();
        let quarterEnd = dayjs().endOf("quarter").toDate();
        setStartDate(quarterStart);
        setEndDate(quarterEnd);
        break;
      case "yearly":
        setStartDate(dayjs().startOf("year").toDate());
        setEndDate(dayjs().endOf("year").toDate());
        break;
      default:
        setStartDate(dayjs().startOf("day").toDate());
        setEndDate(dayjs().endOf("day").toDate());
        break;
    }
  }, [mode]);

  useEffect(() => {
    // Fetch data based on selected mode, start date, and end date
    if (!startDate || !endDate || !mode) {
      return;
    }
    getAnalyticsHelper();
  }, [startDate, endDate]);

  const columns = [
    {
      render: (dat) => {
        return <DataRow data={dat} />;
      },
    },
  ];

  return (
    <div>
      <div className="expense-analytics-container">
        <div
          className="row-flex wid-100"
          style={{ gap: "50px", marginBottom: "20px" }}
        >
          <div className="row-flex" style={{ gap: "50px", marginLeft: "50px" }}>
            <label>
              Select Range:
              <br />
              <br />
              <DateInput
                mode={mode}
                setDates={setDates}
                startDate={startDate}
                endDate={endDate}
              />
            </label>
          </div>
          <div>
            <label>
              Filter:
              <br />
              <br />
              <Select
                defaultValue="daily"
                style={{ width: 120 }}
                onChange={(value) => {
                  setMode(value);
                }}
              >
                <Select.Option value="daily">Daily</Select.Option>
                <Select.Option value="week">Week</Select.Option>
                <Select.Option value="monthly">Monthly</Select.Option>
                {/* <Select.Option value="quarterly">Quarterly</Select.Option> */}
                <Select.Option value="yearly">Yearly</Select.Option>
                <Select.Option value="custom">Custom</Select.Option>
              </Select>
            </label>
          </div>
        </div>
        <br />
        <div
          className="row-flex wid-100"
          style={{ gap: "50px", justifyContent: "center" }}
        >
          <div id="cash-in" style={{ width: "200px" }}>
            <p>Cash In</p>
            <p className="amount-p">
              ₹{convertAmountAddCommas(Math.round(incomeAmount))}
            </p>
          </div>
          <div id="cash-out" style={{ width: "200px" }}>
            <p>Cash Out</p>
            <p className="amount-p">
              ₹{convertAmountAddCommas(Math.round(expenseAmount))}
            </p>
          </div>
        </div>
      </div>
      {allData?.length>0 && (
        <Table dataSource={allData} columns={columns} rowKey={"id"} style={{padding:"0"}}/>
      )}
    </div>
  );
}

export default ExpenseAnalytics;
