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
};
