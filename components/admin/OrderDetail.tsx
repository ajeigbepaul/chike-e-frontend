"use client";

// import  Card  from '@/components/admin/Card'
import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import orderService from "@/services/api/order";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

type OrderDetailProps = {
  order: {
    id: string;
    orderNumber: string;
    date: string;
    status: string;
    customer: string;
    total: number;
    items: Array<{
      id: string;
      product: string;
      quantity: number;
      price: number;
      image?: string;
    }>;
    shippingAddress?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    paymentMethod?: string;
    isPaid?: boolean;
    paidAt?: string;
    taxPrice?: number;
    shippingPrice?: number;
    user?: {
      name: string;
      email: string;
      phone?: string;
    };
  };
};

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'in-transit', label: 'In Transit', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'canceled', label: 'Canceled', color: 'bg-red-100 text-red-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
];

export function OrderDetail({ order }: OrderDetailProps) {
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      orderService.updateOrderStatus(orderId, status, new Date().toISOString()),
    onSuccess: () => {
      toast.success('Order status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['order', order.id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update order status');
    },
  });

  const handleStatusUpdate = () => {
    if (selectedStatus !== order.status) {
      updateStatusMutation.mutate({ orderId: order.id, status: selectedStatus });
    }
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.label || status;
  };

  return (
    <div className="space-y-4">
      <Card title="Order Summary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium">Order Information</h4>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-mono">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p>{order.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getStatusColor(order.status))}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <Badge className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  order.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                )}>
                  {order.isPaid ? 'Paid' : 'Unpaid'}
                </Badge>
                {order.isPaid && order.paidAt && (
                  <p className="text-xs text-gray-500 mt-1">Paid on {new Date(order.paidAt).toLocaleDateString()}</p>
                )}
              </div>
              {order.paymentMethod && (
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium">Customer Information</h4>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm text-gray-500">Customer Name</p>
                <p>{order.user?.name || order.customer}</p>
              </div>
              {order.user?.email && (
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{order.user.email}</p>
                </div>
              )}
              {order.user?.phone && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{order.user.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium text-lg">₦{order.total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {order.shippingAddress && (
        <Card title="Shipping Address">
          <div className="space-y-2">
            {order.shippingAddress.street && <p>{order.shippingAddress.street}</p>}
            <div className="flex gap-2">
              {order.shippingAddress.city && <p>{order.shippingAddress.city}</p>}
              {order.shippingAddress.state && <p>, {order.shippingAddress.state}</p>}
              {order.shippingAddress.zipCode && <p>{order.shippingAddress.zipCode}</p>}
            </div>
            {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
          </div>
        </Card>
      )}

      <Card title="Order Items">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.image && (
                        <Image
                         width={24}
                         height={24} 
                          src={item.image} 
                          alt={item.product} 
                          className="w-10 h-10 rounded object-cover mr-3"
                        />
                      )}
                      <span>{item.product}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₦{item.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₦{(item.quantity * item.price).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-end">
            <div className="space-y-2 text-right">
              {order.taxPrice && (
                <div className="flex justify-between gap-4">
                  <span>Tax:</span>
                  <span>₦{order.taxPrice.toLocaleString()}</span>
                </div>
              )}
              {order.shippingPrice && (
                <div className="flex justify-between gap-4">
                  <span>Shipping:</span>
                  <span>₦{order.shippingPrice.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between gap-4 font-bold text-lg">
                <span>Total:</span>
                <span>₦{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Update Order Status">
        <div className="flex items-center gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button
            onClick={handleStatusUpdate}
            disabled={selectedStatus === order.status || updateStatusMutation.isPending}
            className="bg-brand-yellow text-gray-900 hover:bg-yellow-400"
          >
            {updateStatusMutation.isPending ? 'Updating...' : 'Update Status'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
