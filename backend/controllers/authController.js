import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const serializeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  college: user.college,
  branch: user.branch,
  graduationYear: user.graduationYear
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, college, branch, graduationYear } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password, college, branch, graduationYear });

  res.status(201).json({
    user: serializeUser(user),
    token: generateToken(user._id)
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    user: serializeUser(user),
    token: generateToken(user._id)
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: serializeUser(req.user) });
});
