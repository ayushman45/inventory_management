"use client";

import React, { useEffect, useState } from "react";
import {
  createExpense,
  deleteExpense,
  getExpensesForUser,
} from "../api/handlers/handleExpenses";
import { parseString, stringifyObject } from "../jsonHelper";
import { getUser } from "../helper/token";
import { Button, DatePicker, Input, message, Select, Table } from "antd";
import { expenseDescriptionMap, expenseTypeArray } from "./expenseConfig";
import Header from "@/app/Components/Header";

function Expense() {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [expenseType, setExpenseType] = useState(expenseTypeArray[0]);
  const [description, setDescription] = useState(null);
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(null);

  const deleteExpenseHandler = async (expenseId) => {
    let res = await deleteExpense(stringifyObject({ user, expenseId }));
    if (parseString(res).status === 200) {
      message.success("Expense deleted successfully");
      window.location.reload();
    } else {
      message.error(parseString(res).message);
    }
  };

  const columns = [
    {
      title: "Expense Type",
      dataIndex: "expenseType",
      key: "expenseType",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (note) => (note.trim().length > 0 ? note : "N/A"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Delete",
      key: "delete",
      render: (record) => (
        <Button
          type="primary"
          danger
          onClick={() => deleteExpenseHandler(record._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const addExpense = async () => {
    if (!user || !expenseType || !description || !amount || !date) {
      message.warning("Please fill all the required fields");
      return;
    }
    console.log({ user, expenseType, description, note, amount, date });
    let res = await createExpense(
      stringifyObject({
        expense: { user, expenseType, description, note, amount, date },
      })
    );
    res = parseString(res);
    if (res.status === 200) {
      message.success("Expense Added Successfully");
      fetchExpenses();
    } else {
      message.error("Failed to add expense");
    }
  };

  useEffect(() => {
    if (!expenseType) {
      return;
    }

    setDescription(expenseDescriptionMap[expenseType][0].label);
  }, [expenseType]);

  const fetchExpenses = async () => {
    let response = await getExpensesForUser(stringifyObject({ user }));
    response = parseString(response);
    console.log(response);
    if (response.status === 200) {
      setExpenses(response.data);
    } else {
      setExpenses([]);
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchExpenses();
  }, [user]);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <div>
      <Header />
      <br />
      {expenses && expenses.length > 0 && (
        <div>
          <Table dataSource={expenses} columns={columns} rowKey={"_id"} />
        </div>
      )}

      <h2>Add Expense</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
        id="add-expense"
      >
        <div style={{ display: "flex", flexDirection: "row", gap: "70px" }}>
          <label>
            Expense Type:
            <br />
            <br />
            <Select
              value={expenseType}
              onChange={(value) => setExpenseType(value)}
            >
              {expenseTypeArray.map((expenseHeader) => {
                return (
                  <Select.Option value={expenseHeader} key={expenseHeader}>
                    {expenseHeader}
                  </Select.Option>
                );
              })}
            </Select>
          </label>
          {expenseType && expenseDescriptionMap[expenseType] && (
            <label>
              Expense Description:
              <br />
              <br />
              <Select
                value={description}
                onChange={(value) => setDescription(value)}
              >
                {expenseDescriptionMap[expenseType]?.map((expenseHeader) => {
                  return (
                    <Select.Option
                      value={expenseHeader.label}
                      key={expenseHeader.label}
                    >
                      {expenseHeader.label}
                    </Select.Option>
                  );
                })}
              </Select>
            </label>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "70px" }}>
          <label>
            Amount:
            <br />
            <br />
            <Input
              type="number"
              value={amount}
              placeholder="Amount"
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <label>
            Date:
            <br />
            <br />
            <DatePicker
              onChange={(date, dateStr) => setDate(new Date(dateStr))}
            />
          </label>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "70px" }}>
          <label>
            Note:
            <br />
            <br />
            <Input
              type="text"
              value={note}
              placeholder="Note"
              width={"200px"}
              height={"100px"}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "70px" }}>
          <Button type="primary" onClick={addExpense}>
            Add Expense
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Expense;
