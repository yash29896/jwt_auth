const express = require("express");
const app = express();
const User = require("./models/user");
const mongoose = require("mongoose");
const path = require("path");

mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views"));
app.use(express.urlencoded({ extended: true }));

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  res.json(req.body);
});

app.get("/signup", (req, res) => {
    res.render("signup");
});
app.post("/signup", (req, res) => {
    res.json(req.body);
});

app.listen(3000, () => console.log("Server Started"));
