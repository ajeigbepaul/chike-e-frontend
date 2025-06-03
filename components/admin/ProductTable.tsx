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
import { cn } from '@/lib/utils'

export function ProductTable() {
  // Mock data - replace with your API data
  const products = [
    { id: '1', name: 'Product One', price: 29.99, stock: 24, category: 'Electronics' },
    { id: '2', name: 'Product Two', price: 49.99, stock: 15, category: 'Clothing' },
    { id: '3', name: 'Product Three', price: 19.99, stock: 32, category: 'Home' },
  ]

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>
                <span className={cn(
                  product.stock < 10 ? 'text-red-600' : 'text-green-600'
                )}>
                  {product.stock}
                </span>
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/products/${product.id}`}>Edit</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}