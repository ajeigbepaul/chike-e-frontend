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

export function VendorTable() {
  // Mock data - replace with your API data
  const vendors = [
    { id: '1', name: 'Vendor One', products: 24, sales: 12500, joinDate: '2023-01-15' },
    { id: '2', name: 'Vendor Two', products: 18, sales: 8700, joinDate: '2023-03-22' },
    { id: '3', name: 'Vendor Three', products: 32, sales: 21000, joinDate: '2023-02-10' },
  ]

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Total Sales</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell className="font-medium">{vendor.name}</TableCell>
              <TableCell>{vendor.products}</TableCell>
              <TableCell>${vendor.sales.toLocaleString()}</TableCell>
              <TableCell>{vendor.joinDate}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/vendors/${vendor.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}