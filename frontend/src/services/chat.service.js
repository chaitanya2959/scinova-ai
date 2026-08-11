import api from "./api";

export const askQuestion = async (
  paperId,
  question
) => {
  const response = await api.post(
    `/chat/${paperId}/ask`,
    {
      question,
    }
  );

  return response.data;
};

export const getChatHistory = async (paperId) => {
  const response = await api.get(
    `/chat/${paperId}/history`
  );

  return response.data;
};