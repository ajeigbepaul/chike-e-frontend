import api from "../api";
import { AxiosError } from "axios";
import { Brand } from '@/types/product';
import { ApiResponse } from './category';

export interface CreateBrandData {
  name: string;
}

const brandService = {
  getAllBrands: async (): Promise<ApiResponse<Brand[]>> => {
    try {
      const response = await api.get("/brands");
      return {
        success: true,
        message: "Brands retrieved successfully",
        data: response.data.data.brands,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to retrieve brands",
      };
    }
  },

  createBrand: async (data: CreateBrandData): Promise<ApiResponse<Brand>> => {
    try {
      const response = await api.post("/brands", data);
      return {
        success: true,
        message: "Brand created successfully",
        data: response.data.data.brand,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to create brand",
      };
    }
  },

  updateBrand: async (id: string, data: CreateBrandData): Promise<ApiResponse<Brand>> => {
    try {
      const response = await api.patch(`/brands/${id}`, data);
      return {
        success: true,
        message: "Brand updated successfully",
        data: response.data.data.brand,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to update brand",
      };
    }
  },

  deleteBrand: async (id: string): Promise<ApiResponse<null>> => {
    try {
      await api.delete(`/brands/${id}`);
      return {
        success: true,
        message: "Brand deleted successfully",
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to delete brand",
      };
    }
  }
};

export default brandService; 