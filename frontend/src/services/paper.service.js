import api from "./api";

export const getMyPapers = async () => {
  const response = await api.get("/papers");

  return response.data;
};

export const getPaperById = async (paperId) => {
  const response = await api.get(`/papers/${paperId}`);

  return response.data;
};

export const uploadPaper = async (formData) => {
  const response = await api.post(
    "/papers/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deletePaper = async (paperId) => {
  const response = await api.delete(
    `/papers/${paperId}`
  );

  return response.data;
};
