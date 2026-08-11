import { body } from "express-validator";

export const updateProfileValidator = [
  body("fullName")
    .optional()
    .notEmpty()
    .withMessage("Full name cannot be empty")
    .trim(),

  body("preferences")
    .optional()
    .isObject()
    .withMessage("Preferences must be an object"),

  body("preferences.emailNotifications")
    .optional()
    .isBoolean()
    .withMessage("Email notifications must be true or false"),

  body("preferences.aiResponseStyle")
    .optional()
    .isIn(["detailed", "balanced", "concise"])
    .withMessage("AI response style must be detailed, balanced, or concise"),
];

export const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),

  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];