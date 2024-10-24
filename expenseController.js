const express = require("express");
const { ExpenseModel } = require("./db");

async function getExpenseTotal(req,startDate,endDate){
    try{
        const expense = await ExpenseModel.find({
            userId: req.user.id,
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        })

        const total = expense.reduce((sum,expense)=> sum + expense.amount,0);
        return total;
    }
    catch(error){
        console.error("error fetching or calculating expenses:",error);
        throw new Error("Failed to get expense total");
    }
}

module.exports ={
    getExpenseTotal
}