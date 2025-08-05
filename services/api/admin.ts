import api from "../api";

export interface SalesReportParams {
  startDate?: string;
  endDate?: string;
  period?: "day" | "week" | "month" | "year";
}

export interface SalesReportData {
  date: string;
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface SalesReportResponse {
  status: string;
  data: {
    report: SalesReportData[];
  };
}

export const adminApi = {
  inviteVendor: async (data: { email: string; name: string }) => {
    const response = await api.post("/admin/vendors/invite", data);
    return response.data;
  },

  getSalesReport: async (
    params?: SalesReportParams
  ): Promise<SalesReportResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.period) queryParams.append("period", params.period);

    const response = await api.get(
      `/admin/reports/sales?${queryParams.toString()}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  exportSalesReport: async (params?: SalesReportParams): Promise<Blob> => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.period) queryParams.append("period", params.period);

    const response = await api.get(
      `/admin/reports/sales/export?${queryParams.toString()}`,
      {
        withCredentials: true,
        responseType: "blob",
      }
    );
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get("/admin/dashboard");
    return response.data.data;
  },

  // Vendor management
  getVendors: async (page?: number, limit?: number) => {
    let url = "/admin/vendors";
    if (page !== undefined && limit !== undefined) {
      url += `?page=${page}&limit=${limit}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  getVendorById: async (vendorId: string) => {
    const response = await api.get(`/admin/vendors/${vendorId}`);
    return response.data.data;
  },

  deleteVendor: async (vendorId: string) => {
    const response = await api.delete(`/admin/vendors/${vendorId}`);
    return response.data;
  },

  updateVendorStatus: async (vendorId: string, statusData: { status: string }) => {
    const response = await api.patch(`/admin/vendors/${vendorId}/status`, statusData);
    return response.data;
  },

  // Vendor invitations
  getPendingInvitations: async () => {
    const response = await api.get("/admin/vendor-invitations");
    return response.data.data;
  },

  resendInvitation: async (id: string) => {
    const response = await api.post(`/admin/vendor-invitations/${id}/send`);
    return response.data;
  },

  deleteInvitation: async (id: string) => {
    const response = await api.delete(`/admin/vendor-invitations/${id}`);
    return response.data;
  },

  // Vendor requests
  approveVendorRequest: async (id: string) => {
    const response = await api.patch(`/admin/vendor-requests/${id}/approve`);
    return response.data;
  },
};
