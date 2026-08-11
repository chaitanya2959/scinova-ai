import express from "express";
import {
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/user.controller.js";
import protect from "../middleware/auth.middleware.js";
import {
  updateProfileValidator,
  changePasswordValidator,
} from "../validators/user.validator.js";

const router = express.Router();

// GET /api/users/me
router.get("/me", protect, getCurrentUser);

// PUT /api/users/me
router.put("/me", protect, updateProfileValidator, updateProfile);

// PUT /api/users/change-password
router.put("/change-password", protect, changePasswordValidator, changePassword);

// DELETE /api/users/me
router.delete("/me", protect, deleteAccount);

export default router;