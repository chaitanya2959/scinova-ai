import api from "./api";

export const generateResearchGap = async (paperId) => {
  console.log(
    "Generating research gap:",
    paperId
  );

  const response = await api.post(
    `/research-gaps/${paperId}/generate`
  );

  console.log(
    "Research Gap Response:",
    response.data
  );

  return response.data;
};

export const getResearchGap = async (paperId) => {
  console.log(
    "Fetching research gap:",
    paperId
  );

  const response = await api.get(
    `/research-gaps/${paperId}`
  );

  console.log(
    "Research Gap Fetch Response:",
    response.data
  );

  return response.data;
};
