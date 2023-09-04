const { Router } = require("express");
require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../Model/UserModel");

const userRoutes = Router();

userRoutes.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ name, password: hashedPassword, email });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

userRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  const hash = user.password;

  bcrypt.compare(password, hash, function (err, result) {
    if (err) {
      res.send("something went wrong");
    }

    if (result) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.send({ msg: "login Successful", user, token });
    } else {
      res.send("invalid credentials");
    }
  });
});

module.exports = userRoutes;
