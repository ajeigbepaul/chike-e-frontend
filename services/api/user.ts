import api from "../api";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  wishlist: string[];
  isEmailVerified: boolean;
  addresses: any[];
  createdAt: string;
  updatedAt?: string;
  passwordChangedAt?: string;
  passwordResetExpires?: string;
  passwordResetToken?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface UsersResponse {
  status: string;
  results: number;
  data: {
    users: User[];
  };
  pagination: PaginationResponse;
}

export interface UserResponse {
  status: string;
  data: {
    user: User;
  };
}

const userService = {
  async getCheckoutInfo() {
    const res = await api.get("/users/checkout-info", {
      withCredentials: true,
    });
    return res.data;
  },

  async getAllUsers(params?: PaginationParams): Promise<UsersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const res = await api.get(`/users?${queryParams.toString()}`, {
      withCredentials: true,
    });
    return res.data;
  },

  async getUserById(userId: string): Promise<UserResponse> {
    const res = await api.get(`/users/${userId}`, {
      withCredentials: true,
    });
    return res.data;
  },

  async getCurrentUser(): Promise<UserResponse> {
    const res = await api.get("/users/me", {
      withCredentials: true,
    });
    return res.data;
  },

}


export default userService;
