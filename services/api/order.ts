import api from '../api';

export const createOrder = async (orderData: any) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get('/orders/my-orders');
  return response.data.data.orders;
};

export const getAllOrders = async () => {
  const response = await api.get('/orders');
  return response.data.data.orders;
};

export const updateOrderStatus = async (orderId: string, status: string, date: string) => {
  const response = await api.patch(`/orders/${orderId}`, { status, date });
  return response.data.data.order;
};

const orderService = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
export default orderService; 