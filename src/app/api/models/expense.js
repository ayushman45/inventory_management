import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    expenseType:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    user:{
        type: String,
        required: true
    }
})

export const Expense = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);