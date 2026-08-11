import Paper from "../models/Paper.js";
import Comparison from "../models/Comparison.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  comparePapersWithAI,
} from "../services/ai.service.js";


export const comparePapers = async (req, res) => {
  try {
    const { paperIds } = req.body;

    if (!Array.isArray(paperIds)) {
      return res.status(400).json(
        new ApiResponse(
          false,
          "paperIds must be an array"
        )
      );
    }

    if (paperIds.length < 2) {
      return res.status(400).json(
        new ApiResponse(
          false,
          "Select at least 2 papers"
        )
      );
    }

    if (paperIds.length > 3) {
      return res.status(400).json(
        new ApiResponse(
          false,
          "Maximum 3 papers can be compared"
        )
      );
    }

    const papers = await Paper.find({
      _id: { $in: paperIds },
    });

    if (papers.length !== paperIds.length) {
      return res.status(404).json(
        new ApiResponse(
          false,
          "One or more papers were not found"
        )
      );
    }

    // Verify ownership
    const unauthorized = papers.some(
      (paper) =>
        paper.uploadedBy.toString() !== req.user.id
    );

    if (unauthorized) {
      return res.status(403).json(
        new ApiResponse(
          false,
          "You can only compare your own papers"
        )
      );
    }

    const aiResult =
      await comparePapersWithAI(paperIds);

    let parsedComparison;

    try {
      parsedComparison =
        JSON.parse(aiResult.comparison);
    } catch {
      return res.status(500).json(
        new ApiResponse(
          false,
          "AI returned invalid comparison format"
        )
      );
    }

    const comparison =
      await Comparison.create({
        papers: paperIds,
        ...parsedComparison,
      });

    return res.status(201).json(
      new ApiResponse(
        true,
        "Papers compared successfully",
        comparison
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