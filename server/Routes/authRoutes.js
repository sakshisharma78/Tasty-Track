const express = require("express");
const mongoose = require("mongoose");
const user = require("../models/UserModel");
const getuser = require("../middleware/getusermiddile");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const jwt_SECRT = "sakshisharma123";
const bcrypt = require("bcrypt");
const dotenv=require("dotenv");
dotenv.config();

const mongodbURI = "mongodb+srv://s8634878:YUhy8UeTra4O5B7v@tastytrack.oy4skeg.mongodb.net/";
const router = express.Router();

mongoose.connect("mongodb+srv://s8634878:YUhy8UeTra4O5B7v@tastytrack.oy4skeg.mongodb.net/");

// http://localhost:3000/api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name,contact, email, password } = req.body;

    if (!name ||!contact || !email || !password) {
      res.send("All fields are required");
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      res.send("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new user({
      name,
      contact,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.send({
      success:true
    });
  } catch (err) {
    res.status(500).json({ error: "Some error occurs", err });
  }
});
// http://localhost:3000/api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const avilUser = await user.findOne({ email });
    console.log(avilUser);
    if (!avilUser) {
      return res.send({ authentication: false });
    }
    const isMatch = await bcrypt.compare(password, avilUser.password);
    // const isMatch = password == avilUser.password;
    if (!isMatch) {
      return res.send({ authentication: false });
    }
    const data = {
      user: {
        id: avilUser.id,
      },
    };

    const awthToken = jwt.sign(data, jwt_SECRT);
    return res.send({ authentication: true, token: awthToken });
  } catch (err) {
    res.status(500).json({ error: "Some error occurs", err });
  }
});

// to get user details ----> http://localhost:3000/api/auth/dashboard
router.get("/dashboard", getuser, async (req, res) => {
  try {
    let userId = req.user.id;
    let userdetails = await user.findById(userId).select("-password");
    res.send(userdetails);
  } catch (err) {
    res.status(500).json({ error: "Some error occurs", err });
  }
});

module.exports = router;
