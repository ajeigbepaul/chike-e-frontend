import { ProductTable } from '@/components/admin/ProductTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/products/new">Add Product</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/products/import-export">Import/Export</Link>
          </Button>
        </div>
      </div>
      
      <ProductTable />
    </div>
  )
}