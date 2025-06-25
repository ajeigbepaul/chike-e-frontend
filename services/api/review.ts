import api from "../api";
import { AxiosError } from "axios";
import { ApiResponse } from './category';

export interface Review {
  _id: string;
  review: string;
  rating: number;
  product: string;
  user: {
    _id: string;
    name: string;
    photo?: string;
  };
  createdAt: string;
}

export interface CreateReviewData {
  review: string;
  rating: number;
  product: string;
}

const reviewService = {
  getProductReviews: async (productId: string): Promise<ApiResponse<Review[]>> => {
    try {
      const response = await api.get(`/products/${productId}/reviews`);
      return {
        success: true,
        message: "Reviews retrieved successfully",
        data: response.data.data.reviews,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to retrieve reviews",
      };
    }
  },

  createReview: async (reviewData: CreateReviewData): Promise<ApiResponse<Review>> => {
    try {
      const response = await api.post(`/products/${reviewData.product}/reviews`, reviewData);
      return {
        success: true,
        message: "Review created successfully",
        data: response.data.data.review,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to create review",
      };
    }
  },

  updateReview: async (reviewId: string, reviewData: Partial<CreateReviewData>): Promise<ApiResponse<Review>> => {
    try {
      const response = await api.patch(`/reviews/${reviewId}`, reviewData);
      return {
        success: true,
        message: "Review updated successfully",
        data: response.data.data.review,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to update review",
      };
    }
  },

  deleteReview: async (reviewId: string): Promise<ApiResponse<null>> => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      return {
        success: true,
        message: "Review deleted successfully",
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to delete review",
      };
    }
  },

  reportReview: async (reviewId: string, reason: string): Promise<ApiResponse<Review>> => {
    try {
      const response = await api.post(`/reviews/${reviewId}/report`, { reason });
      return {
        success: true,
        message: "Review reported successfully",
        data: response.data.data.review,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to report review",
      };
    }
  },

  getUserReviews: async (): Promise<ApiResponse<Review[]>> => {
    try {
      const response = await api.get('/reviews/me');
      return {
        success: true,
        message: "User reviews retrieved successfully",
        data: response.data.data.reviews,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to retrieve user reviews",
      };
    }
  }
};

export default reviewService; 