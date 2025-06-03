import Link from 'next/link'
import { Button } from '@/components/ui/button'

type OrderStatusFilterProps = {
  status?: string
}

export function OrderStatusFilter({ status }: OrderStatusFilterProps) {
  return (
    <div className="flex space-x-2">
      <Button variant={!status ? 'default' : 'outline'} asChild>
        <Link href="/admin/orders">All</Link>
      </Button>
      <Button variant={status === 'pending' ? 'default' : 'outline'} asChild>
        <Link href="/admin/orders?status=pending">Pending</Link>
      </Button>
      <Button variant={status === 'completed' ? 'default' : 'outline'} asChild>
        <Link href="/admin/orders?status=completed">Completed</Link>
      </Button>
      <Button variant={status === 'cancelled' ? 'default' : 'outline'} asChild>
        <Link href="/admin/orders?status=cancelled">Cancelled</Link>
      </Button>
    </div>
  )
}