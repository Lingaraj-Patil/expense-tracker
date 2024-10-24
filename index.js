const express = require("express");
const { UserModel, ExpenseModel } = require("./db");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { auth,JWT_SECRET } = require("./auth");
const mongoose = require("mongoose");
const { getExpenseTotal } = require("./expenseController");
const { expenseSchema } = require("./zodValidation");
mongoose.connect("mongodb+srv://username:password@cluster0.qttsn.mongodb.net/expense-tracker")

app.use(express.json());

app.post("/signup",async(req,res)=>{
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    try{
        const existingUser = await UserModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }
        const newUser = await UserModel.create({
            name: username,
            email: email,
            password: password
        })
        res.status(200).json({
            message:"You are signed up"
        })
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"Internal server error"});
    }
})

app.post("/login",async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    try{
        const response = await UserModel.findOne({
            email: email,
        });
    
        if(!response){
            return res.status(411).json({ message:"Invalid Credentials" });
        }
        console.log("User found:", response);

        const isPassword = await bcrypt.compare(password,response.password);
        if(!isPassword){
            return res.status(411).json({ message:"Invalid Credentials" });
        }
        const token = jwt.sign(
            {id: response._id.toString()},
            JWT_SECRET,
            {expiresIn: "24h"}
        )
        console.log("Generated Token:", token);
        res.status(200).json({ token })
        
    }
    catch(error){
        console.error("Login error:",error.message);
        res.status(500).json({ message:"Something went wrong" });
    }  
})

app.post("/expenses",auth,async(req,res)=>{
    const { amount,category,date,description } = req.body;
    try{
        const validatedData = expenseSchema.parse({ amount,category,date,description });
        await ExpenseModel.create({
            amount: validatedData.amount,
            category: validatedData.category,
            date: validatedData.date,
            description: validatedData.description,
            userId: req.user.id
        })
        res.status(201).json({ message:"Expenses added successfully" })    
    }
    catch(error){
        console.error("Expense creation error:",error);
        res.status(500).json({ message:"Something went wrong "})
    }
    
})

app.put("/expenses/:id",auth,async(req,res)=>{
    const expenseId = req.params.id;
    const { amount,category,date,description } = req.body;
    try{
        const expense = await ExpenseModel.findById(expenseId);
        if(!expense){
            return res.status(404).json({message:"Expense not found"});
        }
        console.log("Expense userId:", expense.userId);
        if(expense.userId.toString() !== req.user.id){
            return res.status(403).json({message:"Unauthorised to update the expense"})
        }
        await ExpenseModel.findByIdAndUpdate(
            expenseId,
            { amount,category,date,description },
            {new:true}
        )
        res.status(202).json({ message:"Expense updated successfully"});
    }
    catch(error){
        console.error("Expense updation error:",error);
        res.status(500).json({ message:"Something went wrong "})
    } 
})

app.get("/expenses",auth,async(req,res)=>{
    console.log("User id from jwt: ",req.user.id);
    try{
        const expenses = await ExpenseModel.find({userId:req.user.id});
        res.status(200).json({expenses});
    }
    catch(error){
        console.error("Expense fetching error:",error);
        res.status(500).json({message:"Error occured during fetching todos!"})
    }
})

app.get("/expenses/total",auth,async(req,res)=>{
    const { startDate,endDate } = req.query;
    try{
        const total = await getExpenseTotal(req,startDate,endDate);
        res.status(200).json({"total":total})
    }
    catch(error){
        res.status(500).json({message:"error occured while calculating total expenses"})
    }
})

app.delete("/expenses/:id",auth,async(req,res)=>{
    try{
        const expenseId = req.params.id;
        const deletedExpense = await ExpenseModel.findOneAndDelete({ _id:expenseId ,userId: req.user.id});
        if(!deletedExpense){
            return res.status(404).json({
                message:"expense not found"
            })
        }
        res.status(200).json({ message:"expense delted successfully"});
    }
    catch(error){
        console.error("Error during deletion: ",error);
        res.status(500).json({message:"Internal server error"})
    }
})

app.listen(3000);