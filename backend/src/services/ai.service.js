import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

export const processPaperWithAI = async (filePath, paperId) => {
  try {
    const formData = new FormData();

    formData.append("file", fs.createReadStream(filePath));
    formData.append("paper_id", paperId);

    const response = await axios.post(
      `${AI_SERVICE_URL}/api/pdf/process`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "AI Service Error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to process paper with AI service");
  }
};

export const generatePaperSummary = async (paperId) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/summary/generate`,
      {
        paper_id: paperId,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Summary AI Error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to generate paper summary");
  }
};

export const analyzeResearchGap = async (paperId) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/gap/analyze`,
      {
        paper_id: paperId,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Research Gap AI Error:",
      error.response?.data || error.message
    );

    throw new Error(
      "Failed to analyze research gap"
    );
  }
};

export const comparePapersWithAI = async (paperIds) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/compare/`,
      {
        paper_ids: paperIds,
      }
    );

    return response.data;
  } catch (error) {
    const detail =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Failed to compare papers";

    console.error(
      "Paper Comparison AI Error:",
      error.response?.data || error.message
    );

    throw new Error(detail);
  }
};

export const askPaperQuestion = async (paperId, question) => {
  try {
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/chat/ask`,
      {
        paper_id: paperId,
        question,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Chat AI Error:",
      error.response?.data || error.message
    );

    throw new Error(
      "Failed to get answer from AI"
    );
  }
};
