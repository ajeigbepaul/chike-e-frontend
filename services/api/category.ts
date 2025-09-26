import api from "../api";
import { AxiosError } from "axios";
import { Category } from "@/app/admin/categories/types";

// Type definitions
export interface CreateCategoryData {
  name: string;
  parent?: string;
  isActive?: boolean;
  order?: number;
  image?: File;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  _id: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Category service
const categoryService = {
  /**
   * Get all categories
   */
  getAllCategories: async (): Promise<ApiResponse<Category[]>> => {
    try {
      const response = await api.get("/categories");
      return {
        success: true,
        message: "Categories retrieved successfully",
        data: response.data.data.categories,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to retrieve categories",
      };
    }
  },

  /**
   * Get category by ID
   * @param id Category ID
   */
  getCategoryById: async (id: string): Promise<ApiResponse<Category>> => {
    try {
      const response = await api.get(`/categories/${id}`);
      return {
        success: true,
        message: "Category retrieved successfully",
        data: response.data.data.category,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to retrieve category",
      };
    }
  },

  /**
   * Get category by slug
   * @param slug Category slug
   */
  getCategoryBySlug: async (slug: string): Promise<ApiResponse<Category>> => {
    try {
      const response = await api.get(`/categories/slug/${slug}`);
      return {
        success: true,
        message: "Category retrieved successfully",
        data: response.data.data.category,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to retrieve category",
      };
    }
  },

  /**
   * Create a new category
   * @param data Category creation data
   */
  createCategory: async (
    data: CreateCategoryData | FormData
  ): Promise<ApiResponse> => {
    try {
      let response;
      if (data instanceof FormData) {
        response = await api.post("/categories", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await api.post("/categories", data);
      }
      return {
        success: true,
        message: "Category created successfully",
        data: response.data.data.category,
      };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to create category",
      };
    }
  },

  /**
   * Update an existing category
   * @param data Category update data
   */
  updateCategory: async (
    data: UpdateCategoryData
  ): Promise<ApiResponse<Category>> => {
    try {
      const { _id, ...updateData } = data;
      const formData = new FormData();

      if (updateData.name) formData.append("name", updateData.name);
      if (updateData.parent && updateData.parent.trim() !== "")
        formData.append("parent", updateData.parent);
      if (updateData.isActive !== undefined)
        formData.append("isActive", String(updateData.isActive));
      if (updateData.order !== undefined)
        formData.append("order", String(updateData.order));
      if (updateData.image) formData.append("image", updateData.image);

      const response = await api.patch(`/categories/${_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return {
        success: true,
        message: "Category updated successfully",
        data: response.data.data.category,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to update category",
      };
    }
  },

  /**
   * Update category image only
   * @param categoryId Category ID
   * @param image File to upload
   */
  updateCategoryImage: async (
    categoryId: string,
    image: File
  ): Promise<ApiResponse<Category>> => {
    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await api.patch(`/categories/${categoryId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return {
        success: true,
        message: "Category image updated successfully",
        data: response.data.data.category,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message ||
          "Failed to update category image",
      };
    }
  },

  /**
   * Delete a category
   * @param id Category ID
   */
  deleteCategory: async (id: string): Promise<ApiResponse> => {
    try {
      await api.delete(`/categories/${id}`);
      return {
        success: true,
        message: "Category deleted successfully",
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to delete category",
      };
    }
  },

  /**
   * Export categories to CSV
   */
  exportCategories: async (): Promise<ApiResponse<Blob>> => {
    try {
      const response = await api.get("/categories/export", {
        responseType: "blob",
      });
      return {
        success: true,
        message: "Categories exported successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to export categories",
      };
    }
  },

  /**
   * Import categories from CSV
   * @param file CSV file containing categories
   */
  importCategories: async (file: File): Promise<ApiResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post("/categories/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return {
        success: true,
        message: "Categories imported successfully",
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to import categories",
      };
    }
  },

  /**
   * Update category order
   * @param categoryId Category ID
   * @param newOrder New order value
   */
  updateCategoryOrder: async (
    categoryId: string,
    newOrder: number
  ): Promise<ApiResponse> => {
    try {
      await api.post("/categories/reorder", {
        orders: [{ id: categoryId, order: newOrder }],
      });
      return {
        success: true,
        message: "Category order updated successfully",
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message ||
          "Failed to update category order",
      };
    }
  },

  /**
   * Toggle category status
   * @param categoryId Category ID
   * @param isActive New status
   */
  toggleCategoryStatus: async (
    categoryId: string,
    isActive: boolean
  ): Promise<ApiResponse> => {
    try {
      await api.patch(`/categories/${categoryId}`, { isActive });
      return {
        success: true,
        message: "Category status updated successfully",
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message ||
          "Failed to update category status",
      };
    }
  },
};

export default categoryService;
