const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    password: {
        type: String,
        required: true
    },
    savingsDuration: {
        type: String,

    },
    savingsAmount: String,
    accountName: String,
    accountNumber: String,
    bank: String,
    registration: {
        type: String,
        enum: ["incomplete", "complete"],
        default: "incomplete"
    },
    totalSavings: Number,
});

const User = mongoose.model("User", userSchema);

module.exports = User;


