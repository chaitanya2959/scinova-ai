import api from "./api";

export const comparePapers = async (paperIds) => {
  console.log("Comparing papers:", paperIds);

  const response = await api.post(
    "/comparison",
    {
      paperIds,
    }
  );

  console.log(
    "Comparison response:",
    response.data
  );

  return response.data;
};