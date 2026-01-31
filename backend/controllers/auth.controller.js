require("dotenv").config();

const User = require("../models/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // 1. Import jwt

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 2. Check User
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Check Password
    


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. GENERATE JWT TOKEN
    // payload: data you want to hide in the token 

    const payload = { userId: user._id, email: user.email };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, 
      { expiresIn: "7d" } 
    );

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    // 5. Send Token + User Data
    return res.status(200).json({
      message: "User signed in successfully",
      token: token, 
      user: userResponse,
    });
  } catch (error) {
    console.error(`Error while signing in: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// Sign up controller
exports.signUp = async (req, res) => {
  try {
    console.log("Start processing sign up request");
    const { name, email, password } = req.body;

    console.log("Received data for:", email);

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Prepare response data (excluding password)
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    return res.status(201).json({
      message: "User signed up successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error(`Error while signing up: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
