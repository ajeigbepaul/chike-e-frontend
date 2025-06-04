import api from "../api";
import { AxiosError } from "axios";

// Type definitions
export interface VendorInviteRequest {
  email: string;
  name: string;
  phone?: string;
}

export interface VendorOnboardingRequest {
  token: string;
  password: string;
  phone: string;
  address: string;
  bio: string;
}

export interface VendorVerificationRequest {
  token: string;
}

export interface VendorProfileUpdateRequest {
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
  businessName?: string;
  logo?: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  status: "active" | "pending" | "inactive";
  products: number;
  sales: number;
  joinedDate: string;
  phone?: string;
  businessName?: string;
  address?: string;
  bio?: string;
  logo?: string;
}

export interface VendorStatusUpdateRequest {
  status: "active" | "inactive";
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Vendor service
const vendorService = {
  /**
   * Send an invitation to a potential vendor
   * @param inviteData Vendor invitation data
   */
  inviteVendor: async (inviteData: VendorInviteRequest): Promise<ApiResponse> => {
    try {
      const response = await api.post("/admin/vendors/invite", inviteData);
      return {
        success: true,
        message: "Invitation sent successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to send invitation",
      };
    }
  },

  /**
   * Verify a vendor invitation token
   * @param token The invitation token
   */
  verifyInvitation: async (token: string): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/vendors/verify-invitation?token=${token}`);
      return {
        success: true,
        message: "Invitation verified successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Invalid or expired invitation",
      };
    }
  },

  /**
   * Complete vendor onboarding process
   * @param onboardingData Vendor onboarding data
   */
  completeOnboarding: async (onboardingData: VendorOnboardingRequest): Promise<ApiResponse> => {
    try {
      const response = await api.post("/vendors/onboarding", onboardingData);
      return {
        success: true,
        message: "Onboarding completed successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to complete onboarding",
      };
    }
  },

  /**
   * Get vendor profile
   */
  getProfile: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get("/vendors/profile");
      return {
        success: true,
        message: "Profile retrieved successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to retrieve profile",
      };
    }
  },

  /**
   * Update vendor profile
   * @param profileData Vendor profile data
   */
  updateProfile: async (profileData: VendorProfileUpdateRequest): Promise<ApiResponse> => {
    try {
      const response = await api.put("/vendors/profile", profileData);
      return {
        success: true,
        message: "Profile updated successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to update profile",
      };
    }
  },

  /**
   * Get vendor dashboard stats
   */
  getDashboardStats: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get("/vendors/stats");
      return {
        success: true,
        message: "Stats retrieved successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to retrieve stats",
      };
    }
  },

  /**
   * Admin: Get all vendors
   * @param page Optional page number for pagination
   * @param limit Optional limit of vendors per page
   */
  getVendors: async (page?: number, limit?: number): Promise<ApiResponse<{ vendors: Vendor[], total: number }>> => {
    try {
      let url = "/admin/vendors";
      if (page !== undefined && limit !== undefined) {
        url += `?page=${page}&limit=${limit}`;
      }
      
      const response = await api.get(url);
      return {
        success: true,
        message: "Vendors retrieved successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to retrieve vendors",
      };
    }
  },

  /**
   * Admin: Get vendor by ID
   * @param vendorId The ID of the vendor to retrieve
   */
  getVendorById: async (vendorId: string): Promise<ApiResponse<Vendor>> => {
    try {
      const response = await api.get(`/admin/vendors/${vendorId}`);
      return {
        success: true,
        message: "Vendor retrieved successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to retrieve vendor",
      };
    }
  },

  /**
   * Admin: Update vendor status
   * @param vendorId The ID of the vendor to update
   * @param statusData The new status data
   */
  updateVendorStatus: async (vendorId: string, statusData: VendorStatusUpdateRequest): Promise<ApiResponse> => {
    try {
      const response = await api.patch(`/admin/vendors/${vendorId}/status`, statusData);
      return {
        success: true,
        message: "Vendor status updated successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to update vendor status",
      };
    }
  },

  /**
   * Admin: Delete vendor
   * @param vendorId The ID of the vendor to delete
   */
  deleteVendor: async (vendorId: string): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/admin/vendors/${vendorId}`);
      return {
        success: true,
        message: "Vendor deleted successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to delete vendor",
      };
    }
  },
};

export default vendorService;

