// user.route.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
require("dotenv").config();

const userRouter = express.Router();

// User Registration Route
userRouter.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username is already registered
    const isUserPresent = await UserModel.findOne({ username });
    if (isUserPresent) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({ username, password: hashedPassword });

    await user.save();

    res.status(201).json({ message: "Registration successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong during registration" });
  }
});

// User Login Route
userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const isUserPresent = await UserModel.findOne({ username });
    if (!isUserPresent) {
      return res.status(401).json({ error: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, isUserPresent.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: isUserPresent._id }, process.env.JWT_SECRET, { expiresIn: "4h" });

    res.status(200).json({ message: "Login successful", token, user: isUserPresent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong during login" });
  }
});

module.exports = { userRouter };
