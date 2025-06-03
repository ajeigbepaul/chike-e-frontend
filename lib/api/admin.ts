import { api } from "./api";

export const adminApi = {
  inviteVendor: async (data: { email: string; name: string }) => {
    const response = await api.post("/admin/vendors/invite", data);
    return response.data;
  },
};
