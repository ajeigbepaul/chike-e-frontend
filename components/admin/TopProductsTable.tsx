import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTopProducts } from '@/services/api/products';
import { useQuery } from '@tanstack/react-query';

export function TopProductsTable() {
  const { data: topProducts = [] } = useQuery({
    queryKey: ['topProducts'],
    queryFn: getTopProducts,
  });

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
        {topProducts.map((product, idx) => (
          <TableRow key={idx}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell className="text-right">{product.totalSold}</TableCell>
            <TableCell className="text-right">
              ${product.totalRevenue.toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
