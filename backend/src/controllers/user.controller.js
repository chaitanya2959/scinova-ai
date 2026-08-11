import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * @desc Get Current User
 * @route GET /api/users/me
 * @access Private
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json(
        new ApiResponse(false, "User not found")
      );
    }

    res.status(200).json(
      new ApiResponse(true, "User fetched successfully", { user })
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};

/**
 * @desc Update User Profile
 * @route PUT /api/users/me
 * @access Private
 */
export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(
        new ApiResponse(false, "Validation Failed", errors.array())
      );
    }

    const allowedFields = ["fullName", "preferences"];
    const updates = {};

    // Only allow specific fields to be updated
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json(
        new ApiResponse(false, "User not found")
      );
    }

    res.status(200).json(
      new ApiResponse(true, "Profile updated successfully", { user })
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};

/**
 * @desc Change Password
 * @route PUT /api/users/change-password
 * @access Private
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find user with password
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json(
        new ApiResponse(false, "User not found")
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return res.status(400).json(
        new ApiResponse(false, "Current password is incorrect")
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json(
      new ApiResponse(true, "Password changed successfully")
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};

/**
 * @desc Delete User Account
 * @route DELETE /api/users/me
 * @access Private
 */
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete user's papers
    // Note: Adjust model names based on your actual schema
    const Paper = (await import("../models/Paper.js")).default;
    const Summary = (await import("../models/Summary.js")).default;
    const ResearchGap = (await import("../models/ResearchGap.js")).default;
    const Comparison = (await import("../models/Comparison.js")).default;
    const ChatHistory = (await import("../models/ChatHistory.js")).default;

    // Delete related data
    await Paper.deleteMany({ user: userId });
    await Summary.deleteMany({ user: userId });
    await ResearchGap.deleteMany({ user: userId });
    await Comparison.deleteMany({ user: userId });
    await ChatHistory.deleteMany({ user: userId });

    // Delete user
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json(
        new ApiResponse(false, "User not found")
      );
    }

    res.status(200).json(
      new ApiResponse(true, "Account deleted successfully")
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};