const express = require("express");
const app = express();
const User = require("./models/user");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");

mongoose.connect("mongodb://localhost:27017/yash", {
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
app.post("/signup", async (req, res) => {
  const { name, emailid, password, contact } = req.body.user;
  const hashedPassword = await bcrypt.hash(password, 12);
  const usr = await new User({
    name,
    emailid,
    password: hashedPassword,
    contact,
  });
  await usr.save();
  res.render("details");
});

app.listen(3000, () => console.log("Server Started"));
