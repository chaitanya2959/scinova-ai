import mongoose from "mongoose";

const chatHistorySchema = new mongoose.Schema(
  {
    paper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },

    generatedBy: {
      type: String,
      default: "SciNova AI",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ChatHistory",
  chatHistorySchema
);