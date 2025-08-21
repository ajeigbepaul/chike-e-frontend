import api from '../api';

export interface QuoteRequest {
  productId: string;
  productName: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  message?: string;
  expectedPrice?: number;
  urgency?: 'low' | 'medium' | 'high';
  image?: string;
  serialnos?: string; // New field for serial numbers
}

export interface Message {
  sender: string;
  content: string;
  createdAt: string;
}

export interface ProductInfo {
  _id: string;
  name: string;
  imageCover: string;
  serialNumber?: string;
}

export interface QuoteResponse {
  _id: string;
  productId: ProductInfo;
  productName: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  message?: string;
  expectedPrice?: number;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'responded' | 'accepted' | 'rejected';
  responseMessage?: string;
  approvedPrice?: number;
  approvedQuantity?: number;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
  messages: Message[];
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export const submitQuoteRequest = async (quoteData: QuoteRequest): Promise<QuoteResponse> => {
  try {
    const response = await api.post<ApiResponse<{ quote: QuoteResponse }>>('/quotes', quoteData);
    return response.data.data.quote;
  } catch (error: any) {
    console.error('Error submitting quote request:', error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to submit quote request'
    );
  }
};

export const getQuoteRequests = async (page = 1, limit = 10): Promise<{
  quotes: QuoteResponse[];
  pagination: { total: number; page: number; limit: number; pages: number };
}> => {
  try {
    const response = await api.get<ApiResponse<{
      quotes: QuoteResponse[];
      pagination: { total: number; page: number; limit: number; pages: number };
    }>>(`/quotes?page=${page}&limit=${limit}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching quote requests:', error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch quote requests'
    );
  }
};

export const getQuotesForUser = async (
  customerEmail: string,
  page = 1,
  limit = 10
): Promise<{
  quotes: QuoteResponse[];
  pagination: { total: number; page: number; limit: number; pages: number };
}> => {
  try {
    const response = await api.get<ApiResponse<{
      quotes: QuoteResponse[];
      pagination: { total: number; page: number; limit: number; pages: number };
    }>>(`/quotes/user?customerEmail=${encodeURIComponent(customerEmail)}&page=${page}&limit=${limit}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching user quote requests:', error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch user quote requests'
    );
  }
};

export const getQuoteRequest = async (quoteId: string): Promise<QuoteResponse> => {
  try {
    const response = await api.get<ApiResponse<{ quote: QuoteResponse }>>(`/quotes/${quoteId}`);
    return response.data.data.quote;
  } catch (error: any) {
    console.error('Error fetching quote request:', error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch quote request'
    );
  }
};

export const updateQuoteStatus = async (
  quoteId: string, 
  status: 'responded' | 'accepted' | 'rejected',
  responseMessage?: string,
  approvedPrice?: number,
  approvedQuantity?: number
): Promise<QuoteResponse> => {
  try {
    const response = await api.patch<ApiResponse<{ quote: QuoteResponse }>>(`/quotes/${quoteId}`, {
      status,
      responseMessage,
      approvedPrice,
      approvedQuantity
    });
    return response.data.data.quote;
  } catch (error: any) {
    console.error('Error updating quote status:', error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to update quote status'
    );
  }
};

// Get quotes for a specific product and customer
export const getProductQuoteForCustomer = async (
  productId: string,
  customerEmail: string
): Promise<QuoteResponse | null> => {
  try {
    const response = await api.get<ApiResponse<{ quote: QuoteResponse | null }>>(
      `/quotes/product/${productId}/customer?email=${encodeURIComponent(customerEmail)}`
    );
    return response.data.data.quote;
  } catch (error: any) {
    console.error('Error fetching product quote for customer:', error);
    if (error.response?.status === 404) {
      return null; // No quote found
    }
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch product quote for customer'
    );
  }
};


// patchQuoteMessage
// services/api/quote.ts
export const patchQuoteMessage = async (
  quoteId: string,
  data: { sender: string; content: string }
): Promise<QuoteResponse> => {
  try {
    const response = await api.patch<ApiResponse<{ quote: QuoteResponse }>>(
      `/quotes/${quoteId}/messages`,
      data
    );
    return response.data.data.quote;
  } catch (error: any) {
    console.error('Error patching quote message:', error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to patch quote message'
    );
  }
};