const { Router } = require("express");
require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../Model/UserModel");

const userRoutes = Router();

userRoutes.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ error: "User already exist" });
  }

  bcrypt.hash(password, 8, async function (err, hash) {
    if (err) {
      res.send("something went wrong");
    }

    const user = new UserModel({
      name,
      email,
      password: hash,
    });
    await user.save();
  });
  res.send("signup Successful");
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
