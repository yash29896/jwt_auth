const express = require("express");
const app = express();
const User = require("./models/user");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

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

const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearer;
    return next();
  } else {
    res.redirect("/login");
  }
};

//app.set("view engine", "ejs");
//app.set("views", path.join(__dirname + "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
  
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const usr = await User.findOne({ emailid: req.body.user.emailid });
  const isAuth = await bcrypt.compare(req.body.user.password, usr.password);
  if (isAuth) {
    jwt.sign({ usr }, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
      res.json({ token });
    });
  }
});

app.get("/details", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, userData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.send(userData);
    }
  });
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
