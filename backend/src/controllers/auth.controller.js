import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import generateToken from "../utils/generateToken.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * @desc Register User
 * @route POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(
        new ApiResponse(false, "Validation Failed", errors.array())
      );
    }

    const { fullName, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json(new ApiResponse(false, "Email already exists"));
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = generateToken(user._id, user.role);

    res.status(201).json(
      new ApiResponse(true, "Registration Successful", {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      })
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};

/**
 * @desc Login User
 * @route POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(
        new ApiResponse(false, "Validation Failed", errors.array())
      );
    }

    const { email, password } = req.body;

    // Find User
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json(new ApiResponse(false, "Invalid email or password"));
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json(new ApiResponse(false, "Invalid email or password"));
    }

    // Generate JWT
    const token = generateToken(user._id, user.role);

    res.status(200).json(
      new ApiResponse(true, "Login Successful", {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      })
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};