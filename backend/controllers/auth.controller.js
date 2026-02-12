require("dotenv").config();
const User = require("../models/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod"); // 1. Import Zod

// 2. Define Validation Schemas (Put these at the top)
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

// SIGN IN CONTROLLER
exports.signIn = async (req, res) => {
  try {
    // 3. Zod Validation (Faster than manual IF checks)
    const validation = signInSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: validation.error.errors[0].message 
      });
    }

    const { email, password } = validation.data;

    // 4. Optimized Database Call (.lean() for speed)
    const user = await User.findOne({ email }).select("+password").lean();

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 5. Generate Token
    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    // Send response
    return res.status(200).json({
      message: "User signed in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error(`Error while signing in: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// SIGN UP CONTROLLER
exports.signUp = async (req, res) => {
  try {
    // 6. Zod Validation for Sign Up
    const validation = signUpSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: validation.error.errors[0].message 
      });
    }

    const { name, email, password } = validation.data;

    const existingUser = await User.findOne({ email }).select("_id").lean();
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User signed up successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error(`Error while signing up: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};