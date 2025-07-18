import api from '../api';
import { Promotion } from '@/types/promotion';

interface ApiResponse<T> {
  status: string;
  data: T;
}

export const createPromotion = async (promotionData: Partial<Promotion>): Promise<ApiResponse<{ promotion: Promotion }>> => {
  try {
    const response = await api.post('/promotions', promotionData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating promotion:', error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to create promotion'
    );
  }
};

export const getAllPromotions = async (): Promise<ApiResponse<{ promotions: Promotion[] }>> => {
  try {
    const response = await api.get('/promotions');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching promotions:', error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch promotions'
    );
  }
};

export const getPromotion = async (id: string): Promise<ApiResponse<{ promotion: Promotion }>> => {
  try {
    const response = await api.get(`/promotions/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching promotion with ID ${id}:`, error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      `Failed to fetch promotion with ID ${id}`
    );
  }
};

export const updatePromotion = async (id: string, promotionData: Partial<Promotion>): Promise<ApiResponse<{ promotion: Promotion }>> => {
  try {
    const response = await api.patch(`/promotions/${id}`, promotionData);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating promotion with ID ${id}:`, error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      `Failed to update promotion with ID ${id}`
    );
  }
};

export const deletePromotion = async (id: string): Promise<void> => {
  try {
    await api.delete(`/promotions/${id}`);
  } catch (error: any) {
    console.error(`Error deleting promotion with ID ${id}:`, error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      `Failed to delete promotion with ID ${id}`
    );
  }
};

export const validateCoupon = async ({ code, cartItems }: { code: string; cartItems: any[] }) => {
  try {
    const response = await api.post('/promotions/validate-coupon', { code, cartItems });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to validate coupon'
    );
  }
};
