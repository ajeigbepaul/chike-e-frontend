"use client";

import { useQuery } from '@tanstack/react-query';
import { OrderDetail } from "@/components/admin/OrderDetail";
import orderService from '@/services/api/order';
import { useParams } from 'next/navigation';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-red-600">Order Not Found</h1>
        <p className="text-gray-600">The order you're looking for doesn't exist or you don't have permission to view it.</p>
      </div>
    );
  }

  // Transform the order data to match the OrderDetail component interface
  const transformedOrder = {
    id: order._id || order.id,
    orderNumber: order._id || order.id,
    date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A',
    status: order.status || 'pending',
    customer: order.user?.name || 'Unknown Customer',
    total: order.totalPrice || 0,
    items: (order.orderItems || []).map((item: any) => ({
      id: item._id || item.id,
      product: item.product?.name || item.name || 'Unknown Product',
      quantity: item.quantity || 0,
      price: item.price || 0,
      image: item.product?.imageCover || ''
    })),
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    isPaid: order.isPaid,
    paidAt: order.paidAt,
    taxPrice: order.taxPrice,
    shippingPrice: order.shippingPrice,
    user: order.user
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Order #{transformedOrder.orderNumber}
      </h1>
      
      <OrderDetail order={transformedOrder} />
    </div>
  );
} 