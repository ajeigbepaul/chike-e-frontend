// import { VendorDetail } from '@/components/admin/VendorDetail'
// import { getVendorById } from '@/lib/api/vendors'

import { VendorDetail } from "@/components/admin/VendorDetail"
import { VendorTable } from "@/components/admin/VendorTable"

export default async function VendorDetailPage({
  params,
}: {
  params: { id: string }
}) {
//   const vendor = await getVendorById(params.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {/* {vendor ? `Vendor: ${vendor.name}` : 'Vendor Not Found'} */}
      </h1>
      <VendorDetail vendor={{
        id: '1',
        name: 'Vendor 1',
        email: 'vendor1@example.com',
        joinDate: '2023-01-01',
        totalProducts: 10,
        totalSales: 1000
      }}/>
      {/* {vendor && <VendorDetail vendor={vendor} />} */}
    </div>
  )
}