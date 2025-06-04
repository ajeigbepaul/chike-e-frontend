import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Vendor {
  id: string;
  name: string;
  email: string;
  status: string;
  products: number;
  sales: number;
  joinedDate: string;
  phone: string;
  businessName: string;
  address: string;
}

interface VendorResponse {
  vendors: Vendor[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export function VendorTable() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch("/api/admin/vendors");
        const data: VendorResponse = await response.json();
        if (data.vendors) {
          setVendors(data.vendors);
        }
      } catch (err) {
        setError("Failed to fetch vendors");
        console.error("Error fetching vendors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  if (loading) {
    return <div>Loading vendors...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (vendors.length === 0) {
    return <div>No vendors found</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendor</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Sales</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell className="font-medium">
                {vendor.businessName || vendor.name}
              </TableCell>
              <TableCell>{vendor.email}</TableCell>
              <TableCell>{vendor.phone}</TableCell>
              <TableCell>
                <Badge
                  variant={vendor.status === "active" ? "default" : "secondary"}
                >
                  {vendor.status}
                </Badge>
              </TableCell>
              <TableCell>{vendor.products}</TableCell>
              <TableCell>${vendor.sales.toLocaleString()}</TableCell>
              <TableCell>
                {format(new Date(vendor.joinedDate), "MMM d, yyyy")}
              </TableCell>
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
  );
}
