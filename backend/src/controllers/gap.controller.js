import ResearchGap from "../models/ResearchGap.js";
import Paper from "../models/Paper.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  analyzeResearchGap,
} from "../services/ai.service.js";


export const generateResearchGap = async (req, res) => {
  try {
    const { paperId } = req.params;

    const paper = await Paper.findById(paperId);

    if (!paper) {
      return res.status(404).json(
        new ApiResponse(
          false,
          "Paper not found"
        )
      );
    }

    if (
      paper.uploadedBy.toString() !==
      req.user.id
    ) {
      return res.status(403).json(
        new ApiResponse(
          false,
          "Access denied"
        )
      );
    }

    const aiResult =
      await analyzeResearchGap(paperId);

    let parsedAnalysis;

    try {
      parsedAnalysis =
        JSON.parse(aiResult.analysis);
    } catch {
      return res.status(500).json(
        new ApiResponse(
          false,
          "AI returned invalid JSON"
        )
      );
    }

    const researchGap =
      await ResearchGap.findOneAndUpdate(
        { paper: paperId },
        {
          paper: paperId,
          ...parsedAnalysis,
        },
        {
          new: true,
          upsert: true,
        }
      );

    return res.status(200).json(
      new ApiResponse(
        true,
        "Research gap analysis generated successfully",
        researchGap
      )
    );

  } catch (error) {

    return res.status(500).json(
      new ApiResponse(
        false,
        error.message
      )
    );
  }
};