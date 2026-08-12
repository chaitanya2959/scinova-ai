import Paper from "../models/Paper.js";
import Comparison from "../models/Comparison.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  comparePapersWithAI,
} from "../services/ai.service.js";

export const comparePapers = async (req, res) => {
  try {
    const { paperIds } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

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

    // -----------------------------
    // FIND PAPERS
    // -----------------------------

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

    // -----------------------------
    // OWNERSHIP CHECK
    // -----------------------------

    const unauthorized = papers.some(
      (paper) =>
        paper.uploadedBy.toString() !==
        req.user.id.toString()
    );

    if (unauthorized) {
      return res.status(403).json(
        new ApiResponse(
          false,
          "You can only compare your own papers"
        )
      );
    }

    console.log(
      "Comparing papers:",
      paperIds
    );

    // -----------------------------
    // CALL AI SERVICE
    // -----------------------------

    const aiResult =
      await comparePapersWithAI(
        paperIds
      );

    console.log(
      "AI RESULT:",
      JSON.stringify(
        aiResult,
        null,
        2
      )
    );

    // -----------------------------
    // GET COMPARISON STRING
    // -----------------------------

    let comparisonData =
      aiResult?.comparison;

    if (!comparisonData) {
      return res.status(500).json(
        new ApiResponse(
          false,
          "AI did not return comparison data"
        )
      );
    }

    // -----------------------------
    // PARSE JSON STRING
    // -----------------------------

    if (
      typeof comparisonData ===
      "string"
    ) {
      try {
        comparisonData =
          JSON.parse(
            comparisonData
          );
      } catch (error) {
        console.error(
          "Comparison JSON parse error:",
          error
        );

        return res.status(500).json(
          new ApiResponse(
            false,
            "AI returned invalid comparison JSON"
          )
        );
      }
    }

    console.log(
      "PARSED COMPARISON:",
      JSON.stringify(
        comparisonData,
        null,
        2
      )
    );

    // -----------------------------
    // SAVE COMPARISON
    // -----------------------------

    const comparison =
      await Comparison.create({
        papers: paperIds,

        objectives:
          comparisonData.objectives ||
          "",

        methodologies:
          comparisonData.methodologies ||
          "",

        technologies:
          comparisonData.technologies ||
          "",

        findings:
          comparisonData.findings ||
          "",

        limitations:
          comparisonData.limitations ||
          "",

        similarities:
          Array.isArray(
            comparisonData.similarities
          )
            ? comparisonData.similarities
            : [],

        differences:
          Array.isArray(
            comparisonData.differences
          )
            ? comparisonData.differences
            : [],

        researchOpportunities:
          Array.isArray(
            comparisonData.researchOpportunities
          )
            ? comparisonData.researchOpportunities
            : [],

        generatedBy:
          "SciNova AI",
      });

    // -----------------------------
    // SUCCESS
    // -----------------------------

    return res.status(201).json(
      new ApiResponse(
        true,
        "Papers compared successfully",
        comparison
      )
    );

  } catch (error) {
    console.error(
      "COMPARE PAPERS ERROR:",
      error
    );

    return res.status(500).json(
      new ApiResponse(
        false,
        error.message
      )
    );
  }
};