// eslint-disable-next-line react/no-children-prop

import { Card } from "./Card"

type VendorDetailProps = {
  vendor: {
    id: string
    name: string
    email: string
    joinDate: string
    totalProducts: number
    totalSales: number
  }
}

export function VendorDetail({ vendor }: VendorDetailProps) {
  return (
    <div className="space-y-4">
      <Card title="Vendor Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium">Basic Info</h4>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p>{vendor.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{vendor.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Join Date</p>
                <p>{vendor.joinDate}</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium">Performance</h4>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p>{vendor.totalProducts}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Sales</p>
                <p>${vendor.totalSales.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Recent Products" children={undefined}>
        {/* Product list would go here */}
      </Card>
    </div>
  )
}