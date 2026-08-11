import fs from "fs";
import Paper from "../models/Paper.js";
import Summary from "../models/Summary.js";
import ResearchGap from "../models/ResearchGap.js";
import ChatHistory from "../models/ChatHistory.js";
import Comparison from "../models/Comparison.js";
import ApiResponse from "../utils/ApiResponse.js";
import { processPaperWithAI } from "../services/ai.service.js";

// =====================================================
// Upload Paper
// POST /api/papers/upload
// =====================================================
export const uploadPaper = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Check title
    if (!title) {
      return res.status(400).json(
        new ApiResponse(
          false,
          "Paper title is required"
        )
      );
    }

    // Check PDF
    if (!req.file) {
      return res.status(400).json(
        new ApiResponse(
          false,
          "PDF file is required"
        )
      );
    }

    // =================================================
    // 1. Save paper information in MongoDB
    // =================================================
    const paper = await Paper.create({
      title,
      description,
      category,
      authors: [],
      pdfUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.filename,
      fileSize: req.file.size,
      uploadedBy: req.user.id,
    });

    console.log(
      `📄 Paper created: ${paper._id}`
    );

    // =================================================
    // 2. Send PDF to Python AI Service
    // =================================================
    try {
      console.log(
        "🤖 Sending paper to AI service..."
      );

      await processPaperWithAI(
        req.file.path,
        paper._id.toString()
      );

      console.log(
        "✅ Paper processed successfully by AI service"
      );

      // Update AI status if field exists
      paper.aiStatus = "completed";

      await paper.save();

    } catch (aiError) {

      console.error(
        "❌ AI processing failed:",
        aiError.message
      );

      // Update AI status if field exists
      paper.aiStatus = "failed";

      await paper.save();
    }

    // =================================================
    // 3. Send response
    // =================================================
    return res.status(201).json(
      new ApiResponse(
        true,
        "Paper uploaded successfully",
        paper
      )
    );

  } catch (error) {

    console.error(
      "Upload Paper Error:",
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


// =====================================================
// Get All Papers
// GET /api/papers
// =====================================================
export const getPapers = async (req, res) => {
  try {

    const papers = await Paper.find({
      uploadedBy: req.user.id,
    })
      .populate(
        "uploadedBy",
        "fullName email"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json(
      new ApiResponse(
        true,
        "Papers fetched successfully",
        papers
      )
    );

  } catch (error) {

    console.error(
      "Get Papers Error:",
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


// =====================================================
// Get Single Paper
// GET /api/papers/:id
// =====================================================
export const getPaperById = async (req, res) => {
  try {

    const paper = await Paper.findById(
      req.params.id
    ).populate(
      "uploadedBy",
      "fullName email"
    );

    if (!paper) {
      return res.status(404).json(
        new ApiResponse(
          false,
          "Paper not found"
        )
      );
    }

    return res.status(200).json(
      new ApiResponse(
        true,
        "Paper fetched successfully",
        paper
      )
    );

  } catch (error) {

    console.error(
      "Get Paper Error:",
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


// =====================================================
// Update Paper
// PUT /api/papers/:id
// =====================================================
export const updatePaper = async (req, res) => {
  try {

    const {
      title,
      description,
      category,
    } = req.body;

    const paper = await Paper.findById(
      req.params.id
    );

    if (!paper) {
      return res.status(404).json(
        new ApiResponse(
          false,
          "Paper not found"
        )
      );
    }

    // Check ownership
    if (
      paper.uploadedBy.toString() !==
      req.user.id
    ) {
      return res.status(403).json(
        new ApiResponse(
          false,
          "You can only update your own paper"
        )
      );
    }

    // Update fields
    paper.title =
      title ?? paper.title;

    paper.description =
      description ?? paper.description;

    paper.category =
      category ?? paper.category;

    await paper.save();

    return res.status(200).json(
      new ApiResponse(
        true,
        "Paper updated successfully",
        paper
      )
    );

  } catch (error) {

    console.error(
      "Update Paper Error:",
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


// =====================================================
// Delete Paper
// DELETE /api/papers/:id
// =====================================================
export const deletePaper = async (req, res) => {
  try {

    const paper = await Paper.findById(
      req.params.id
    );

    if (!paper) {
      return res.status(404).json(
        new ApiResponse(
          false,
          "Paper not found"
        )
      );
    }

    // Check ownership
    if (
      paper.uploadedBy.toString() !==
      req.user.id
    ) {
      return res.status(403).json(
        new ApiResponse(
          false,
          "You can only delete your own paper"
        )
      );
    }

    // =================================================
    // Delete PDF from uploads folder
    // =================================================
    const filePath =
      paper.pdfUrl.replace(
        "/uploads/",
        "uploads/"
      );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

      console.log(
        "🗑️ PDF deleted:",
        filePath
      );
    }

    // =================================================
    // Delete related data
    // =================================================
    
    // Delete summary
    await Summary.findOneAndDelete({ paper: req.params.id });
    
    // Delete research gap
    await ResearchGap.findOneAndDelete({ paper: req.params.id });
    
    // Delete chat history
    await ChatHistory.deleteMany({ paper: req.params.id });
    
    // Delete comparisons that include this paper
    await Comparison.deleteMany({ papers: req.params.id });

    // =================================================
    // Delete MongoDB document
    // =================================================
    await paper.deleteOne();

    return res.status(200).json(
      new ApiResponse(
        true,
        "Paper deleted successfully"
      )
    );

  } catch (error) {

    console.error(
      "Delete Paper Error:",
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