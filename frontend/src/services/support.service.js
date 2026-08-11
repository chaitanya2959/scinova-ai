import api from "./api";

export const createSupportTicket = async (data) => {
  const response = await api.post("/support", data);
  return response.data;
};