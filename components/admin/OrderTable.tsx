"use client";
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import orderService from '@/services/api/order';
import { useState, useEffect } from 'react';
import React from 'react';
import toast from 'react-hot-toast';

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Transit', value: 'in-transit' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Canceled', value: 'canceled' },
  { label: 'Completed', value: 'completed' },
];

type OrderTableProps = {
  status?: string
}

export function OrderTable({ status }: OrderTableProps) {
  const queryClient = useQueryClient();
  // const { toast } = useToast();
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ['all-orders'],
    queryFn: orderService.getAllOrders,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, date }: { id: string, status: string, date: string }) => orderService.updateOrderStatus(id, status, date),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({queryKey:['all-orders']});
      if (variables.status && variables.date) {
        toast.success(`Order Updated  Status changed to '${variables.status}' and date set. ${variables.date} `
         );
      } else if (variables.status) {
        toast.success(`Order Updated  Status changed to '${variables.status}'`
        );
      } else if (variables.date) {
        toast.success(`Order Updated  Status changed to '${variables.date}'`)

        }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const filteredOrders = !status ? orders : orders.filter((order: any) => order.status === status);

  const [rowState, setRowState] = useState<{ [orderId: string]: { editStatus: string, editDate: string } }>({});

  useEffect(() => {
    if (filteredOrders.length) {
      setRowState((prev) => {
        const newState = { ...prev };
        filteredOrders.forEach((order: any) => {
          const id = order._id || order.id;
          if (!newState[id]) {
            newState[id] = {
              editStatus: order.status,
              editDate: order.statusDate || '',
            };
          }
        });
        return newState;
      });
    }
  }, [filteredOrders]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Status Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow>
          ) : isError ? (
            <TableRow><TableCell colSpan={7} className="text-red-500">Failed to load orders.</TableCell></TableRow>
          ) : filteredOrders.length === 0 ? (
            <TableRow><TableCell colSpan={7}>No orders found.</TableCell></TableRow>
          ) : filteredOrders.map((order: any) => {
            const id = order._id || order.id;
            const editStatus = rowState[id]?.editStatus ?? order.status;
            const editDate = rowState[id]?.editDate ?? (order.statusDate || '');
            return (
              <TableRow key={id}>
                <TableCell className="font-medium">#{id}</TableCell>
                <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</TableCell>
                <TableCell>{order.user?.name || order.customer || ''}</TableCell>
                <TableCell>₦{order.totalPrice ? order.totalPrice.toLocaleString() : order.total?.toLocaleString()}</TableCell>
                <TableCell>
                  <select
                    className="border rounded px-2 py-1"
                    value={editStatus}
                    onChange={e => {
                      const newStatus = e.target.value;
                      setRowState(prev => ({
                        ...prev,
                        [id]: {
                          ...prev[id],
                          editStatus: newStatus,
                        },
                      }));
                      updateMutation.mutate({ id, status: newStatus, date: editDate });
                    }}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </TableCell>
                <TableCell>
                  <input
                    type="date"
                    className="border rounded px-2 py-1"
                    value={editDate}
                    onChange={e => {
                      const newDate = e.target.value;
                      setRowState(prev => ({
                        ...prev,
                        [id]: {
                          ...prev[id],
                          editDate: newDate,
                        },
                      }));
                      updateMutation.mutate({ id, status: editStatus, date: newDate });
                    }}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/orders/${id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  )
}