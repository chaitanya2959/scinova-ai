import mongoose from "mongoose";

const summarySchema = new mongoose.Schema(
  {
    paper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
      required: true,
      unique: true,
    },

    objective: {
      type: String,
      default: "",
    },

    methodology: {
      type: String,
      default: "",
    },

    keyFindings: {
      type: [String],
      default: [],
    },

    conclusion: {
      type: String,
      default: "",
    },

    futureDirections: {
      type: [String],
      default: [],
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

export default mongoose.model("Summary", summarySchema);