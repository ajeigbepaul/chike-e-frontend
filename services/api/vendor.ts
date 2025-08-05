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
  status: "request" | "pending" | "accepted" | "rejected";
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

export interface VendorDirectOnboardingRequest {
  userId: string;
  password: string;
  phone: string;
  address: string;
  bio: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface VendorInvitation {
  _id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  token: string;
}

// Vendor service
const vendorService = {
  /**
   * Send an invitation to a potential vendor
   * @param inviteData Vendor invitation data
   */
  inviteVendor: async (
    inviteData: VendorInviteRequest
  ): Promise<ApiResponse> => {
    try {
      const response = await api.post("/vendors/invite", inviteData);
      return {
        success: true,
        message: "Invitation sent successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to send invitation",
      };
    }
  },

  /**
   * Verify a vendor invitation token
   * @param token The invitation token
   */
  verifyInvitation: async (token: string): Promise<ApiResponse> => {
    try {
      const response = await api.get(
        `/vendors/verify-invitation?token=${token}`
      );
      return {
        success: true,
        message: "Invitation verified successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Invalid or expired invitation",
      };
    }
  },

  /**
   * Complete vendor onboarding process
   * @param onboardingData Vendor onboarding data
   */
  completeOnboarding: async (
    onboardingData: VendorOnboardingRequest
  ): Promise<ApiResponse> => {
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
        message:
          axiosError.response?.data?.message || "Failed to complete onboarding",
      };
    }
  },

  /**
   * Direct vendor onboarding (no invitation)
   * @param onboardingData Direct onboarding data
   */
  directOnboarding: async (
    onboardingData: VendorDirectOnboardingRequest
  ): Promise<ApiResponse> => {
    try {
      const response = await api.post(
        "/vendors/direct-onboarding",
        onboardingData
      );
      return {
        success: true,
        message: "Onboarding completed successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to complete onboarding",
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
        message:
          axiosError.response?.data?.message || "Failed to retrieve profile",
      };
    }
  },

  /**
   * Update vendor profile
   * @param profileData Vendor profile data
   */
  updateProfile: async (
    profileData: VendorProfileUpdateRequest
  ): Promise<ApiResponse> => {
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
        message:
          axiosError.response?.data?.message || "Failed to update profile",
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
        message:
          axiosError.response?.data?.message || "Failed to retrieve stats",
      };
    }
  },

  /**
   * Admin: Get all vendors
   * @param page Optional page number for pagination
   * @param limit Optional limit of vendors per page
   */
  getVendors: async (
    page?: number,
    limit?: number
  ): Promise<
    ApiResponse<{
      data: any;
      vendors: Vendor[];
      total: number;
    }>
  > => {
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
        message:
          axiosError.response?.data?.message || "Failed to retrieve vendors",
      };
    }
  },

  /**
   * Admin: Get vendor by ID
   * @param vendorId The ID of the vendor to retrieve
   */
  getVendorById: async (vendorId: string): Promise<ApiResponse<Vendor>> => {
    try {
      const response = await api.get(`/vendors/admin/${vendorId}`);
      return {
        success: true,
        message: "Vendor retrieved successfully",
        data: response.data.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to retrieve vendor",
      };
    }
  },

  /**
   * Admin: Update vendor status
   * @param vendorId The ID of the vendor to update
   * @param statusData The new status data
   */
  updateVendorStatus: async (
    vendorId: string,
    statusData: VendorStatusUpdateRequest
  ): Promise<ApiResponse> => {
    try {
      const response = await api.patch(
        `/admin/vendors/${vendorId}/status`,
        statusData
      );
      return {
        success: true,
        message: "Vendor status updated successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message ||
          "Failed to update vendor status",
      };
    }
  },

  /**
   * Admin: Delete vendor
   * @param vendorId The ID of the vendor to delete
   */
  deleteVendor: async (vendorId: string): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/vendors/admin/${vendorId}`);
      return {
        success: true,
        message: "Vendor deleted successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to delete vendor",
      };
    }
  },

  /**
   * Admin: Get all vendors (for product form)
   */
  getAllVendors: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get("/vendors/all");
      return {
        success: true,
        message: "Vendors retrieved successfully",
        data: response.data.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to fetch vendors",
      };
    }
  },

  /**
   * Request a vendor invitation (public form)
   * @param inviteData Vendor invite request data
   */
  requestVendorInvite: async (
    inviteData: VendorInviteRequest
  ): Promise<ApiResponse> => {
    try {
      const response = await api.post("/vendors/request-invite", inviteData);
      return {
        success: true,
        message: response.data?.message || "Request submitted successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to submit request",
      };
    }
  },

  /**
   * Get all pending vendor invitations (admin only)
   */
  // getPendingInvitations: async (): Promise<ApiResponse<VendorInvitation[]>> => {
  //   try {
  //     const response = await api.get("/vendors/admin/vendor-invitations");
  //     return {
  //       success: true,
  //       message: "Pending invitations retrieved successfully",
  //       data: response.data.data,
  //     };
  //   } catch (error) {
  //     const axiosError = error as AxiosError<any>;
  //     return {
  //       success: false,
  //       message:
  //         axiosError.response?.data?.message || "Failed to fetch invitations",
  //     };
  //   }
  // },
  getPendingInvitations: async (): Promise<ApiResponse<VendorInvitation[]>> => {
    try {
      const response = await api.get("/vendors/admin/vendor-invitations");
      return {
        success: true,
        message: "Pending invitations retrieved successfully",
        data: response.data.data,
      };
    } catch (error) {
      const axiosError = error as any;
      return {
        success: false,
        message: axiosError.response?.data?.message || "Failed to fetch invitations",
      };
    }
  },
  /**
   * Admin: Resend a pending vendor invitation
   */
  resendInvitation: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await api.post(
        `/vendors/admin/vendor-invitations/${id}/send`
      );
      return {
        success: true,
        message: response.data?.message || "Invitation resent successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to resend invitation",
      };
    }
  },

  /**
   * Admin: Delete a pending vendor invitation
   */
  deleteInvitation: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await api.delete(
        `/vendors/admin/vendor-invitations/${id}`
      );
      return {
        success: true,
        message: response.data?.message || "Invitation deleted successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to delete invitation",
      };
    }
  },

  /**
   * Admin: Approve a vendor request and send invitation
   */
  approveVendorRequest: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await api.patch(
        `/vendors/admin/vendor-requests/${id}/approve`
      );
      return {
        success: true,
        message: response.data?.message || "Vendor request approved successfully",
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to approve vendor request",
      };
    }
  },
};

export default vendorService;
