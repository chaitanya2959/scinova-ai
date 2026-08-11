import Paper from "../models/Paper.js";
import ChatHistory from "../models/ChatHistory.js";
import ApiResponse from "../utils/ApiResponse.js";
import { askPaperQuestion } from "../services/ai.service.js";

export const askQuestion = async (req, res) => {
  try {
    const { paperId } = req.params;
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json(
        new ApiResponse(false, "Question is required")
      );
    }

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

    // Generate answer using AI
    const aiResult = await askPaperQuestion(paperId, question);

    // Save chat history
    const chatEntry = await ChatHistory.create({
      paper: paperId,
      user: req.user.id,
      question,
      answer: aiResult.answer,
      generatedBy: "SciNova AI",
    });

    return res.status(200).json(
      new ApiResponse(true, "Answer generated successfully", {
        question,
        answer: aiResult.answer,
        generatedBy: "SciNova AI",
      })
    );

  } catch (error) {
    console.error("Chat Error:", error);
    return res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { paperId } = req.params;

    const chatHistory = await ChatHistory.find({
      paper: paperId,
      user: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(true, "Chat history fetched successfully", chatHistory)
    );

  } catch (error) {
    console.error("Chat History Error:", error);
    return res.status(500).json(
      new ApiResponse(false, error.message)
    );
  }
};
