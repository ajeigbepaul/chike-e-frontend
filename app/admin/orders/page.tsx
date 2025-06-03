import { OrderTable } from '@/components/admin/OrderTable'
import { OrderStatusFilter } from '@/components/admin/OrderStatusFilter'

export default function OrdersPage({
  searchParams,
}: {
  searchParams?: { status?: string }
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <OrderStatusFilter status={searchParams?.status} />
      </div>
      
      <OrderTable status={searchParams?.status} />
    </div>
  )
}