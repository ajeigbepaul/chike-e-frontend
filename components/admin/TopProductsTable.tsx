import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TopProductsTable() {
  // Mock data - replace with your API data
  const products = [
    { id: "1", name: "Product A", sales: 150, revenue: 15000 },
    { id: "2", name: "Product B", sales: 120, revenue: 12000 },
    { id: "3", name: "Product C", sales: 100, revenue: 10000 },
    { id: "4", name: "Product D", sales: 80, revenue: 8000 },
    { id: "5", name: "Product E", sales: 60, revenue: 6000 },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead className="text-right">Units Sold</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell className="text-right">{product.sales}</TableCell>
            <TableCell className="text-right">
              ${product.revenue.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
