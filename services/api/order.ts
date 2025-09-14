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

export const updateOrderPaymentReference = async (
  orderId: string,
  paymentReference: string
) => {
  console.log("Updating order payment reference:", {
    orderId,
    paymentReference,
  });
  const response = await api.patch(`/orders/${orderId}/payment-reference`, {
    paymentReference,
  });
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
  console.log("=== FRONTEND PAYMENT VERIFICATION ===");
  console.log("Reference:", reference);
  console.log("Payment Gateway:", paymentGateway);
  console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL);
  console.log(
    "Full URL will be:",
    `${process.env.NEXT_PUBLIC_API_URL}/payments/verify`
  );

  try {
    const response = await api.post("/payments/verify", {
      reference,
      paymentGateway,
    });
    console.log("Payment verification successful:", response.data);
    return response.data.data.order;
  } catch (error: any) {
    console.error("Payment verification failed:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    console.error("Error config:", error.config);
    throw error;
  }
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
  updateOrderPaymentReference,
  initializePayment,
  verifyPayment,
  getCheckoutInfo,
  updateCheckoutInfo,
  deleteOrder,
  downloadInvoice,
};
export default orderService;
