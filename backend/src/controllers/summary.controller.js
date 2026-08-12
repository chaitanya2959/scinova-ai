import Summary from "../models/Summary.js";
import Paper from "../models/Paper.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generatePaperSummary } from "../services/ai.service.js";

export const generateSummary = async (req, res) => {
  try {
    const { paperId } = req.params;

    const paper = await Paper.findById(paperId);

    if (!paper) {
      return res.status(404).json(
        new ApiResponse(false, "Paper not found")
      );
    }

    if (paper.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json(
        new ApiResponse(false, "Access denied")
      );
    }

    const aiResult = await generatePaperSummary(paperId);

    let parsedSummary;

    try {
      parsedSummary = JSON.parse(aiResult.summary);
    } catch {
      return res.status(500).json(
        new ApiResponse(
          false,
          "AI returned an invalid summary format"
        )
      );
    }

    const summary = await Summary.findOneAndUpdate(
      { paper: paperId },
      {
        paper: paperId,
        ...parsedSummary,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json(
      new ApiResponse(
        true,
        "Summary generated successfully",
        summary
      )
    );
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};

export const getSummary = async (req, res) => {
  try {
    const { paperId } = req.params;

    const summary = await Summary.findOne({ paper: paperId });

    if (!summary) {
      return res.status(200).json(
        new ApiResponse(true, "No summary found yet", null)
      );
    }

    return res.status(200).json(
      new ApiResponse(true, "Summary fetched successfully", summary)
    );

  } catch (error) {
    return res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};
