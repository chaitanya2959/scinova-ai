import mongoose from "mongoose";

const comparisonSchema = new mongoose.Schema(
  {
    papers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Paper",
      },
    ],

    objectives: {
      type: String,
      default: "",
    },

    methodologies: {
      type: String,
      default: "",
    },

    technologies: {
      type: String,
      default: "",
    },

    findings: {
      type: String,
      default: "",
    },

    limitations: {
      type: String,
      default: "",
    },

    similarities: {
      type: [String],
      default: [],
    },

    differences: {
      type: [String],
      default: [],
    },

    researchOpportunities: {
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

export default mongoose.model("Comparison", comparisonSchema);