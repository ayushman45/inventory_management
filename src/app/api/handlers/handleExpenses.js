"use server"

import { connectDB, disconnectDB } from "../db";
import { Expense } from "../../../backendHelpers/models/expense";
import { send } from "./sendToFrontEnd";
import { status } from "../../../backendHelpers/status";


export async function createExpense(req){
    try{
        await connectDB();
        let { expense } = JSON.parse(req);
        if(!expense.user){
            return send({status: status.FORBIDDEN, message: "Unauthorized access"});
        }
        let exp = new Expense(expense);
        await exp.save();
        return send({status: status.SUCCESS, data: exp});
    }
    catch(err){
        console.log(err.message)
        return send({status: status.INTERNAL_SERVER_ERROR, message: err.message});
    }
    finally{
        await disconnectDB();
    }
}

export async function deleteExpense(req){
    try{
        await connectDB();
        let { expenseId, user } = JSON.parse(req);
        if(!user){
            return send({status: status.FORBIDDEN, message: "Unauthorized access"});
        }
        await Expense.findByIdAndDelete(expenseId);
        return send({status: status.SUCCESS, message: "Expense deleted successfully"});
    }
    catch(err){
        return send({status: status.INTERNAL_SERVER_ERROR, message: "Internal Server Error"});
    }
    finally{
        await disconnectDB();
    }
}

export async function updateExpense(req){
    try{
        await connectDB();
        let { expense, user } = JSON.parse(req);
        if(!user){
            return send({status: status.FORBIDDEN, message: "Unauthorized access"});
        }
        let temp = await Expense.findByIdAndUpdate(expense._id, expense, {new: true});
        return send({status: status.SUCCESS, data: temp});
    }
    catch(err){
        return send({status: status.INTERNAL_SERVER_ERROR, message: err.message});
    }
    finally{
        await disconnectDB();
    }
}

export const getExpensesForUser = async function(req){
    try{
        await connectDB();
        let { user } = JSON.parse(req);
        if(!user){
            return send({status: status.FORBIDDEN, message: "Unauthorized access"});
        }
        let expenses = await Expense.find({user});
        return send({status: status.SUCCESS, data: expenses});
    }
    catch(err){
        return send({status: status.INTERNAL_SERVER_ERROR, message: err.message});
    }
    finally{
        await disconnectDB();
    }
}