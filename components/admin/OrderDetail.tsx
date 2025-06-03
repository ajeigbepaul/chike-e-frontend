// import  Card  from '@/components/admin/Card'
import { cn } from "@/lib/utils";
import { Card } from "./Card";

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
    }>;
  };
};

export function OrderDetail({ order }: OrderDetailProps) {
  return (
    <div className="space-y-4">
      <Card title="Order Summary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium">Order Information</h4>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p>{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p>{order.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  {order.status}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium">Customer Information</h4>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p>{order.customer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

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
                    {item.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
