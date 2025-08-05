"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
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
import {
  PlusIcon,
  SearchIcon,
  RefreshCw,
  Eye,
  Mail,
  Trash2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import vendorService, {
  VendorInviteRequest,
  Vendor,
  VendorInvitation,
} from "@/services/api/vendor";
import { format } from "date-fns";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import toast from "react-hot-toast";

// Dynamically import the dialog component with no SSR
const VendorInviteDialog = dynamic(
  () =>
    import("@/components/admin/VendorInviteDialog").then(
      (mod) => mod.VendorInviteDialog
    ),
  { ssr: false }
);

export default function VendorsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const response = await vendorService.getVendors();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch vendors");
      }
      return response.data?.data?.vendors || [];
    },
  });

  // Fetch pending invitations and requests
  const {
    data: invitationsData,
    isLoading: isInvitationsLoading,
    isError: isInvitationsError,
  } = useQuery({
    queryKey: ["pending-invitations"],
    queryFn: async () => {
      const response = await vendorService.getPendingInvitations();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch invitations");
      }
      return response.data || [];
    },
  });

  const vendors = data || [];
  const pendingInvitations: VendorInvitation[] = invitationsData || [];

  // Merge vendors and invitations for display
  const allRows = [
    ...pendingInvitations.map((inv) => ({
      id: inv._id,
      name: inv.name,
      email: inv.email,
      status: inv.status, // Use request or pending
      joinedDate: inv.createdAt,
      isInvitation: true,
    })),
    ...vendors.map((vendor: any) => ({
      ...vendor,
      isInvitation: false,
    })),
  ];

  const filteredRows = search
    ? allRows.filter(
        (row: any) =>
          row.name.toLowerCase().includes(search.toLowerCase()) ||
          row.email.toLowerCase().includes(search.toLowerCase())
      )
    : allRows;

  const handleRefresh = () => {
    refetch();
  };

  const handleInviteVendor = async (data: VendorInviteRequest) => {
    try {
      const response = await vendorService.inviteVendor(data);
      if (response.success) {
        toast.success("Vendor invitation sent successfully");
        setShowInviteDialog(false);
        queryClient.invalidateQueries({ queryKey: ["vendors", "pending-invitations"] });
      } else {
        throw new Error(response.message || "Failed to send invitation");
      }
    } catch (error: any) {
      console.error("Invite vendor error:", error);
      toast.error(error.message || "Failed to send invitation");
    }
  };

  const handleApproveRequest = async (id: string) => {
    try {
      const response = await vendorService.approveVendorRequest(id);
      if (response.success) {
        toast.success("Vendor request approved and invitation sent successfully");
        queryClient.invalidateQueries({ queryKey: ["pending-invitations"] });
      } else {
        throw new Error(response.message || "Failed to approve request");
      }
    } catch (error: any) {
      console.error("Approve request error:", error);
      toast.error(error.message || "Failed to approve vendor request");
    }
  };

  const handleViewVendor = (vendorId: string) => {
    router.push(`/admin/vendors/${vendorId}`);
  };

  const resendMutation = useMutation({
    mutationFn: (id: string) => vendorService.resendInvitation(id),
    onSuccess: (data) => {
      toast.success(data.message || "Invitation resent successfully");
      queryClient.invalidateQueries({ queryKey: ["pending-invitations"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to resend invitation");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vendorService.deleteInvitation(id),
    onSuccess: (data) => {
      toast.success(data.message || "Invitation deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["pending-invitations"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete invitation");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vendor Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
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

      {isError && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">
            {error instanceof Error ? error.message : "An unknown error occurred."}
          </span>
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
              <TableHead>Joined/Requested</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isInvitationsLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No vendors or invitations found
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row: any) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        row.status === "active"
                          ? "default"
                          : row.status === "request"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {row.joinedDate
                      ? format(new Date(row.joinedDate), "MMM d, yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {row.isInvitation ? (
                      <div className="flex gap-2">
                        {row.status === "request" ? (
                          <button
                            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
                            onClick={() => handleApproveRequest(row.id)}
                            title="Approve Request and Send Invitation"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Approve Request
                          </button>
                        ) : (
                          <button
                            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
                            onClick={() => resendMutation.mutate(row.id)}
                            disabled={resendMutation.isPending}
                            title="Resend Invitation"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            {resendMutation.isPending ? "Resending..." : "Resend"}
                          </button>
                        )}
                        <button
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800 hover:bg-red-200 transition"
                          onClick={() => deleteMutation.mutate(row.id)}
                          disabled={deleteMutation.isPending}
                          title="Delete Invitation"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewVendor(row.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    )}
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