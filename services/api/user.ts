import axios from "axios";

const userService = {
  async getCheckoutInfo() {
    const res = await axios.get("/api/v1/users/checkout-info", { withCredentials: true });
    return res.data;
  },
};

export default userService;
