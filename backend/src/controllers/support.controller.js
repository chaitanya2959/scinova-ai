import SupportTicket from "../models/SupportTicket.js";
import { validationResult } from "express-validator";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * @desc Create Support Ticket
 * @route POST /api/support
 * @access Private
 */
export const createSupportTicket = async (req, res) => {
  try {
    // Validation
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(
        new ApiResponse(false, "Validation Failed", errors.array())
      );
    }

    const { name, email, subject, message } = req.body;

    // Create support ticket
    const ticket = await SupportTicket.create({
      user: req.user.id,
      name,
      email,
      subject,
      message,
      status: "open",
    });

    res.status(201).json(
      new ApiResponse(true, "Support request submitted successfully", { ticket })
    );
  } catch (error) {
    res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};