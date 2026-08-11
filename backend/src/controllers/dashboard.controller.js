import Paper from "../models/Paper.js";
import Summary from "../models/Summary.js";
import ResearchGap from "../models/ResearchGap.js";
import Comparison from "../models/Comparison.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total papers uploaded by user
    const totalPapers = await Paper.countDocuments({
      uploadedBy: userId,
    });

    // Total AI analyses (summaries generated)
    const aiAnalyses = await Summary.countDocuments();

    // Total research gaps generated
    const researchGaps = await ResearchGap.countDocuments();

    // Total comparisons made
    const comparisons = await Comparison.countDocuments();

    // Recent papers (last 5)
    const recentPapers = await Paper.find({
      uploadedBy: userId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title description createdAt");

    return res.status(200).json(
      new ApiResponse(true, "Dashboard stats fetched successfully", {
        totalPapers,
        aiAnalyses,
        researchGaps,
        comparisons,
        recentPapers,
      })
    );
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};