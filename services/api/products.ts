import  api  from '../api';
import { Product } from '@/types/product';

interface ApiResponse {
  status: string;
  data: {
    product: Product;
  };
}

export const createProduct = async (formData: FormData): Promise<ApiResponse> => {
    try {
      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating product:', error);
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to create product'
      );
    }
  };
  
  export const updateProduct = async (productId: string, formData: FormData): Promise<ApiResponse> => {
    try {
      const response = await api.patch(`/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error updating product:', error);
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to update product'
      );
    }
  };

export const getProduct = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data.data.product;
};

export const getProducts = async (page = 1, limit = 10): Promise<{ products: Product[]; pagination: { total: number; page: number; limit: number; pages: number } }> => {
  const response = await api.get(`/products?page=${page}&limit=${limit}`);
  return {
    products: response.data.data.products,
    pagination: response.data.pagination
  };
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

export const getTopProducts = async (): Promise<Array<{ name: string; image: string; totalSold: number; totalRevenue: number }>> => {
  const response = await api.get('/admin/dashboard');
  return response.data.data.topProducts;
};

export const getRelatedProducts = async (id: string): Promise<Product[]> => {
  const response = await api.get(`/products/${id}/related`);
  return response.data.data;
}; 