"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import userService, { User } from "@/services/api/user";
import { format } from "date-fns";
import Spinner from "@/components/Spinner";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const userId = params.id as string;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await userService.getUserById(userId);
      if (response.status !== "success") {
        throw new Error("Failed to fetch user");
      }
      return response;
    },
    enabled: !!userId,
  });

  const user: User | undefined = data?.data?.user;

  const handleBack = () => {
    router.push("/admin/users");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "vendor":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error instanceof Error
            ? error.message
            : "An unknown error occurred."}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>

      <div className="grid gap-6">
        {/* User Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="text-lg font-semibold">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-lg">{user.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Phone
                </label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-lg">{user.phone || "Not provided"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Role
                </label>
                <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email Verification
                </label>
                <div className="flex items-center gap-2 mt-1">
                  {user.isEmailVerified ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        Verified
                      </Badge>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <Badge variant="secondary">Unverified</Badge>
                    </>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Member Since
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p>{format(new Date(user.createdAt), "MMM d, yyyy")}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Wishlist Items
                </label>
                <p className="text-lg">{user.wishlist.length} items</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Saved Addresses
                </label>
                <p className="text-lg">{user.addresses.length} addresses</p>
              </div>
              {user.passwordChangedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Password Last Changed
                  </label>
                  <p className="text-lg">
                    {format(
                      new Date(user.passwordChangedAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
              )}
              {user.updatedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Last Updated
                  </label>
                  <p className="text-lg">
                    {format(
                      new Date(user.updatedAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
