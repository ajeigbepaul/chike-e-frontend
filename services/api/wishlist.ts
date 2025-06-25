import api from '../api';

export const addToWishlist = async (productId: string) => {
  try {
    const response = await api.post('/wishlist', { productId });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to add to wishlist'
    );
  }
};

export const removeFromWishlist = async (productId: string) => {
  try {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to remove from wishlist'
    );
  }
};

export const getWishlist = async () => {
  try {
    const response = await api.get('/wishlist');
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch wishlist'
    );
  }
};

const wishlistService = { addToWishlist, removeFromWishlist, getWishlist };
export default wishlistService; 