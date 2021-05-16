const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")


const authRoute = require("./routes/authRoute"); 
const userRoute = require("./routes/userRoute");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true}));

app.use(cookieParser());

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index");
})
app.use(authRoute);
app.use(userRoute);

mongoose.connect("mongodb://localhost:27017/easyThrift").then(() => {
    console.log("Database connection successful");
})
app.listen(3000, () => {
    console.log("app connected on port 3000");
})