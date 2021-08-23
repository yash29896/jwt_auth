const express = require("express");
const app = express();
const User = require("./models/user");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

mongoose.connect("mongodb+srv://ya17kun:feEm2eBzBX9q5U4B@cluster0.pqshj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
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
    req.token = bearerToken;
    return next();
  } else {
    res.sendStatus(403);
  }
};

app.use(express.urlencoded({ extended: true }));

app.post("/login", async (req, res) => {
  const usr = await User.findOne({ emailid: req.body.emailid });
  if (!usr) return res.sendStatus(404);
  const isAuth = await bcrypt.compare(req.body.password, usr.password);
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

app.post("/signup", async (req, res) => {
  const { name, emailid, password, contact } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const usr = await new User({
    name,
    emailid,
    password: hashedPassword,
    contact,
  });
  await usr.save();
  res.sendStatus(200);
});

app.listen(3000, () => console.log("Server Started"));
