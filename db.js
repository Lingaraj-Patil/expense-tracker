const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const User = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password:{ type: String, required: true}
})

User.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

const Expense = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    amount: { type: Number, required: true},
    category: { type: String, required: true},
    date: { type:Date , default: Date.now},
    description: String  
})

const UserModel = mongoose.model('user',User);
const ExpenseModel = mongoose.model('expense',Expense);

module.exports = {
    UserModel,
    ExpenseModel
};