import api from "../api";

const userService = {
  async getCheckoutInfo() {
    const res = await api.get("/api/v1/users/checkout-info", { withCredentials: true });
    return res.data;
  },
};

export default userService;
