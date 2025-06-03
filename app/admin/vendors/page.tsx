"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { PlusIcon, SearchIcon } from "lucide-react";
import { VendorInviteDialog } from "@/components/admin/VendorInviteDialog";

// Mock data - replace with actual API call
const mockVendors = [
  {
    id: "1",
    name: "John's Store",
    email: "john@example.com",
    status: "active",
    products: 25,
    sales: 15000,
    joinedDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Sarah's Shop",
    email: "sarah@example.com",
    status: "pending",
    products: 0,
    sales: 0,
    joinedDate: "2024-02-01",
  },
];

export default function VendorsPage() {
  const { toast } = useToast();
  const [vendors, setVendors] = useState(mockVendors);
  const [search, setSearch] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(search.toLowerCase()) ||
      vendor.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleInviteVendor = async (data: { email: string; name: string }) => {
    try {
      const response = await fetch("/api/admin/vendors/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to invite vendor");
      }

      toast({
        title: "Success",
        description: "Vendor invitation sent successfully",
      });

      setShowInviteDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send vendor invitation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vendor Management</h1>
        <Button onClick={() => setShowInviteDialog(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Invite Vendor
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Total Sales</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      vendor.status === "active" ? "default" : "secondary"
                    }
                  >
                    {vendor.status}
                  </Badge>
                </TableCell>
                <TableCell>{vendor.products}</TableCell>
                <TableCell>${vendor.sales.toLocaleString()}</TableCell>
                <TableCell>
                  {new Date(vendor.joinedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <VendorInviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        onSubmit={handleInviteVendor}
      />
    </div>
  );
}
