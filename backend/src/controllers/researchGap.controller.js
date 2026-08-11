import Paper from "../models/Paper.js";
import ResearchGap from "../models/ResearchGap.js";
import ApiResponse from "../utils/ApiResponse.js";
import { analyzeResearchGap as generateResearchGapAI } from "../services/ai.service.js";

export const generateResearchGap = async (req, res) => {
  try {
    const { paperId } = req.params;

    // Find paper
    const paper = await Paper.findById(paperId);

    if (!paper) {
      return res.status(404).json(
        new ApiResponse(false, "Research paper not found")
      );
    }

    // Check ownership
    if (paper.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json(
        new ApiResponse(false, "Access denied")
      );
    }

    // Generate research gap using AI
    const aiResult = await generateResearchGapAI(paperId);

    let parsedGap;

    try {
      parsedGap = JSON.parse(aiResult.gap);
    } catch {
      return res.status(500).json(
        new ApiResponse(false, "AI returned invalid research gap format")
      );
    }

    // Save to MongoDB
    const researchGap = await ResearchGap.findOneAndUpdate(
      { paper: paperId },
      {
        paper: paperId,
        ...parsedGap,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json(
      new ApiResponse(true, "Research gap generated successfully", researchGap)
    );

  } catch (error) {
    console.error("Research Gap Error:", error);
    return res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};

export const getResearchGap = async (req, res) => {
  try {
    const { paperId } = req.params;

    const researchGap = await ResearchGap.findOne({ paper: paperId });

    if (!researchGap) {
      return res.status(404).json(
        new ApiResponse(false, "Research gap not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(true, "Research gap fetched successfully", researchGap)
    );

  } catch (error) {
    console.error("Get Research Gap Error:", error);
    return res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};
