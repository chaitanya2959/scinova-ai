import mongoose from "mongoose";

const researchGapSchema = new mongoose.Schema(
  {
    paper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
      required: true,
      unique: true,
    },

    gaps: {
      type: [String],
      default: [],
    },

    limitations: {
      type: [String],
      default: [],
    },

    missingAreas: {
      type: [String],
      default: [],
    },

    opportunities: {
      type: [String],
      default: [],
    },

    researchDirections: {
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

export default mongoose.model(
  "ResearchGap",
  researchGapSchema
);