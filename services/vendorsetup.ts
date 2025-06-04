import api from "./api";

export const vendorSetup = async (data: any) => {
  const response = await api.post("/vendors/setup", data);
  return response.data;
};

