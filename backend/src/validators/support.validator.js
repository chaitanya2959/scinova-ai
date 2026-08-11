import { body } from "express-validator";

export const createSupportTicketValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .trim(),

  body("email")
    .isEmail()
    .withMessage("Invalid email address"),

  body("subject")
    .notEmpty()
    .withMessage("Subject is required")
    .trim(),

  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .trim(),
];