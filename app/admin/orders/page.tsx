import { OrderTable } from '@/components/admin/OrderTable'
import { OrderStatusFilter } from '@/components/admin/OrderStatusFilter'

export default async function OrdersPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>
}) {
  const params = await searchParams;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <OrderStatusFilter status={params?.status} />
      </div>
      
      <OrderTable status={params?.status} />
    </div>
  )
}