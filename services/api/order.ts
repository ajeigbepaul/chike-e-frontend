import api from "../api";

export const createOrder = async (orderData: any) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders");
  return response.data.data.orders;
};

export const getAllOrders = async () => {
  const response = await api.get("/orders");
  return response.data.data.orders;
};

export const getOrderById = async (orderId: string) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data.data.order;
};

export const updateOrderStatus = async (
  orderId: string,
  status: string,
  date: string
) => {
  const response = await api.patch(`/orders/${orderId}`, { status, date });
  return response.data.data.order;
};

export const initializePayment = async (
  orderId: string,
  paymentGateway: string = "paystack"
) => {
  const response = await api.post("/payments/initialize", {
    orderId,
    paymentGateway,
  });
  return response.data.data;
};

export const verifyPayment = async (
  reference: string,
  paymentGateway: string = "paystack"
) => {
  const response = await api.post("/payments/verify", {
    reference,
    paymentGateway,
  });
  return response.data.data.order;
};

export const getCheckoutInfo = async () => {
  const response = await api.get("/users/checkout-info");
  return response.data.data.checkoutInfo;
};

export const updateCheckoutInfo = async (checkoutInfo: any) => {
  const response = await api.patch("/users/checkout-info", { checkoutInfo });
  return response.data.data.checkoutInfo;
};

export const deleteOrder = async (orderId: string) => {
  const response = await api.delete(`/orders/${orderId}`);
  return response.data;
};

export const downloadInvoice = async (orderId: string): Promise<Blob> => {
  const response = await api.get(`/orders/${orderId}/invoice`, {
    responseType: "blob",
  });
  return response.data as Blob;
};

const orderService = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  initializePayment,
  verifyPayment,
  getCheckoutInfo,
  updateCheckoutInfo,
  deleteOrder,
  downloadInvoice,
};
export default orderService;
