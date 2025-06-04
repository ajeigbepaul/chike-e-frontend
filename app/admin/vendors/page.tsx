"use client";

import { useState, useEffect } from "react";
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
import { PlusIcon, SearchIcon, RefreshCw, Eye } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import vendorService, { VendorInviteRequest, Vendor } from "@/services/api/vendor";
import { format } from "date-fns";
import Spinner from "@/components/Spinner";

// Dynamically import the dialog component with no SSR
const VendorInviteDialog = dynamic(
  () =>
    import("@/components/admin/VendorInviteDialog").then(
      (mod) => mod.VendorInviteDialog
    ),
  { ssr: false }
);

export default function VendorsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  // Fetch vendors from the API
  const fetchVendors = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await vendorService.getVendors();
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch vendors');
      }
      
      if (response.data && response.data.vendors) {
        setVendors(response.data.vendors);
      } else {
        setVendors([]);
      }
    } catch (err: any) {
      console.error('Error fetching vendors:', err);
      setError(err.message || 'Failed to load vendors. Please try again.');
      setVendors([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize vendors on client-side only
  useEffect(() => {
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(search.toLowerCase()) ||
      vendor.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRefresh = () => {
    fetchVendors();
  };

  const handleInviteVendor = async (data: VendorInviteRequest) => {
    try {
      setInviteLoading(true);
      const response = await vendorService.inviteVendor(data);

      if (response.success) {
        toast({
          title: "Success",
          description: "Vendor invitation sent successfully",
        });
        setShowInviteDialog(false);
        // Refresh the vendor list to include the new invitation
        fetchVendors();
      } else {
        throw new Error(response.message || "Failed to send invitation");
      }
    } catch (error: any) {
      console.error("Invite vendor error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setInviteLoading(false);
    }
  };

  const handleViewVendor = (vendorId: string) => {
    router.push(`/admin/vendors/${vendorId}`);
  };

  // Handle vendor status update
  const handleStatusUpdate = async (vendorId: string, status: "active" | "inactive") => {
    try {
      setIsLoading(true);
      const response = await vendorService.updateVendorStatus(vendorId, { status });
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Vendor status updated successfully",
        });
        // Refresh the vendor list to reflect the status change
        fetchVendors();
      } else {
        throw new Error(response.message || "Failed to update vendor status");
      }
    } catch (error: any) {
      console.error("Update vendor status error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update vendor status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vendor Management</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowInviteDialog(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Invite Vendor
          </Button>
        </div>
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <Button 
            variant="link" 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={handleRefresh}
          >
            Try again
          </Button>
        </div>
      )}

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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : filteredVendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No vendors found
                </TableCell>
              </TableRow>
            ) : (
              filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        vendor.status === "active" 
                          ? "default" 
                          : vendor.status === "pending" 
                            ? "secondary" 
                            : "outline"
                      }
                    >
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{vendor.products}</TableCell>
                  <TableCell>${vendor.sales.toLocaleString()}</TableCell>
                  <TableCell>
                    {format(new Date(vendor.joinedDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewVendor(vendor.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showInviteDialog && (
        <VendorInviteDialog
          open={showInviteDialog}
          onOpenChange={setShowInviteDialog}
          onSubmit={handleInviteVendor}
        />
      )}
    </div>
  );
}
