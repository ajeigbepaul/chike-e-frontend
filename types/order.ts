export interface OrderItem {
  _id?: string;
  id?: string;
  product?: {
    _id: string;
    name: string;
    price: number;
    imageCover?: string;
  };
  name?: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

export interface ShippingAddress {
  type?: 'home' | 'work' | 'other';
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Order {
  _id: string;
  id?: string;
  user: User;
  orderItems: OrderItem[];
  shippingAddress?: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  paymentReference?: string;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  status: 'pending' | 'processing' | 'in-transit' | 'delivered' | 'canceled' | 'completed';
  statusHistory?: Array<{
    status: string;
    date: Date;
    changedBy: string;
  }>;
  currentStatusDate?: string;
  trackingNumber?: string;
  trackingCompany?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  _id: string;
  user: string | User;
  order?: string | Order;
  status?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
} 