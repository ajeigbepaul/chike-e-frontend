"use client";

import { useQuery } from "@tanstack/react-query";
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
  SearchIcon,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import userService, { User, PaginationParams } from "@/services/api/user";
import { format } from "date-fns";
import Spinner from "@/components/Spinner";
import { useState } from "react";

export default function UsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["users", pagination],
    queryFn: async () => {
      const response = await userService.getAllUsers(pagination);
      if (response.status !== "success") {
        throw new Error("Failed to fetch users");
      }
      return response;
    },
  });

  const users = data?.data?.users || [];
  const paginationData = data?.pagination;

  const handleRefresh = () => {
    refetch();
  };

  const handleViewUser = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination({ page: 1, limit: newLimit });
  };

  const filteredUsers = search
    ? users.filter(
        (user: User) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.role.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <select
          value={pagination.limit}
          onChange={(e) => handleLimitChange(Number(e.target.value))}
          className="border rounded px-3 py-2"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      {isError && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">
            {error instanceof Error
              ? error.message
              : "An unknown error occurred."}
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
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user: User) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "admin"
                          ? "default"
                          : user.role === "vendor"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        user.role === "admin"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : user.role === "vendor"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.isEmailVerified ? "default" : "secondary"}
                    >
                      {user.isEmailVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewUser(user._id)}
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

      {/* Pagination Controls */}
      {paginationData && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(paginationData.page - 1) * paginationData.limit + 1} to{" "}
            {Math.min(
              paginationData.page * paginationData.limit,
              paginationData.total
            )}{" "}
            of {paginationData.total} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(paginationData.page - 1)}
              disabled={paginationData.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {paginationData.page} of {paginationData.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(paginationData.page + 1)}
              disabled={paginationData.page >= paginationData.pages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
