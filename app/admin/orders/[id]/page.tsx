// import { OrderDetail } from '@/components/admin/OrderDetail'
// import { getOrderById } from '@/lib/api/orders'

import { OrderDetail } from "@/components/admin/OrderDetail"

// import { OrderDetail } from "@/components/admin/OrderDetail"

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
//   const order = await getOrderById(params.id)

  return (
    <div className="space-y-6">
      {/* <h1 className="text-2xl font-bold">
        Order #{order?.orderNumber || 'Not Found'}
      </h1> */}
      
      {/* {order && <OrderDetail order={order} />} */}
      <OrderDetail order={{
        id: '1',
        orderNumber: '1234567890',
        date: '2023-01-01',
        status: 'pending',
        customer: 'John Doe',
        total: 100,
        items: [
            {
                id: '1',
                product: 'Product 1',
                quantity: 1,
                price: 100
            }
        ]
      }}/>
      
      
    </div>
  )
}