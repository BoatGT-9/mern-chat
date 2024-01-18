const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const User =require("./model/User")
const salt = bcrypt.genSaltSync(10);
dotenv.config();
const app = express();
// ส่วนของ middleware
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
// app.use("/upload", express.static(__dirname+"/upload"))

// ต่อกับฐานข้อมูล
const MONGODB_URL = process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL);

app.get("/", (req, res) => {
  res.send("<h1>รันได้แน้วนร้าา</h1> ");
});

// Register

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});


// Login

const secret = process.env.SECRET;
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (userDoc) {
    const isMatchPassword = bcrypt.compareSync(password, userDoc.password);
    if (isMatchPassword) {
      jwt.sign({ username, id: userDoc._id }, secret, (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
          id: userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json("รหัสผ่านไม่ถูกต้อง");
    }
  } else {
    res.status(400).json("ไม่พบผู้ใช้งาน");
  }
});

// logout
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

// Profile
app.get("/profile", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, secret, {}, (err, userDate) => {
      if (err) throw err;
      res.json(userDate);
    });
  } else {
    res.status(401).json("no token");
  }
});

// ส่วนของช่อง PORT
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("SERVER is running on http://localhost:" + PORT);
});
