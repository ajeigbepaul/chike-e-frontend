"use client";

import { useState } from 'react';
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

import vendorService from "@/services/api/vendor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Trash2, Briefcase, Mail, Phone, Calendar, ArrowLeft } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function VendorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params.id as string;
  const queryClient = useQueryClient();

  const [isDeleting, setIsDeleting] = useState(false);

  const { data: vendor, isLoading, isError, error } = useQuery({
    queryKey: ["vendor", vendorId],
    queryFn: () => vendorService.getVendorById(vendorId),
    enabled: !!vendorId,
  });

  const deleteMutation = useMutation({
    mutationFn: () => vendorService.deleteVendor(vendorId),
    onSuccess: () => {
      toast.success("Vendor deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      router.push('/admin/vendors');
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete vendor");
    },
    onSettled: () => {
      setIsDeleting(false);
    }
  });

  const handleDelete = () => {
    setIsDeleting(true);
    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error?.message || "Failed to load vendor details."}
        </AlertDescription>
      </Alert>
    );
  }

  if (!vendor?.data) {
    return <div className="text-center py-8">Vendor not found</div>;
  }

  const { name, email, phone, businessName, address, bio, status, joinedDate, products, sales } = vendor.data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Vendors
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">{businessName || name}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Vendor
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the vendor and their associated user account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Vendor Details</h3>
              <div className="flex items-center text-sm">
                <Briefcase className="mr-3 h-5 w-5 text-gray-500" />
                <span>{businessName || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="mr-3 h-5 w-5 text-gray-500" />
                <a href={`mailto:${email}`} className="hover:underline">{email}</a>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="mr-3 h-5 w-5 text-gray-500" />
                <span>{phone || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="mr-3 h-5 w-5 text-gray-500" />
                <span>Joined on {format(new Date(joinedDate), 'PPP')}</span>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Address & Bio</h3>
              <p className="text-sm text-gray-600">{address || 'No address provided.'}</p>
              <p className="text-sm text-gray-600 italic">{bio || 'No bio provided.'}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Performance Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{products || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${sales ? sales.toLocaleString() : '0'}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
