import api from "./api";

export const generateSummary = async (paperId) => {
  console.log("Calling Summary API:", paperId);

  const response = await api.post(
    `/summaries/${paperId}/generate`
  );

  console.log(
    "Summary API Response:",
    response.data
  );

  return response.data;
};

export const getSummary = async (paperId) => {
  console.log("Fetching Summary:", paperId);

  const response = await api.get(
    `/summaries/${paperId}`
  );

  console.log(
    "Summary Fetch Response:",
    response.data
  );

  return response.data;
};
