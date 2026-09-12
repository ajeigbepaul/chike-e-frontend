"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { Loader2, Edit, Trash2, Eye } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import advertService, { type Advert } from "@/services/api/advert";
import AdvertForm from "@/app/admin/advert/components/AdvertForm";

/** The service returns raw axios errors, so dig out the server message first. */
const getErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message || error?.message || fallback;

interface AdvertTableProps {
  adverts: Advert[];
  isLoading: boolean;
}

export function AdvertTable({ adverts, isLoading }: AdvertTableProps) {
  const queryClient = useQueryClient();

  const [advertToView, setAdvertToView] = useState<Advert | null>(null);
  const [advertToEdit, setAdvertToEdit] = useState<Advert | null>(null);
  const [advertToDelete, setAdvertToDelete] = useState<Advert | null>(null);

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      advertService.updateAdvert(id, formData),
    onSuccess: () => {
      toast.success("Advert updated successfully");
      // Same key the storefront hero uses, so the homepage refreshes too.
      queryClient.invalidateQueries({ queryKey: ["adverts"] });
      setAdvertToEdit(null);
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, "Failed to update advert"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => advertService.deleteAdvert(id),
    onSuccess: () => {
      toast.success("Advert deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adverts"] });
      setAdvertToDelete(null);
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error, "Failed to delete advert"));
    },
  });

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>SubTitle</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>CTA</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : adverts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-gray-500"
                >
                  No adverts found
                </TableCell>
              </TableRow>
            ) : (
              adverts.map((advert) => (
                <TableRow key={advert._id}>
                  <TableCell>
                    <Image
                      src={advert.image}
                      alt={advert.title}
                      width={64}
                      height={32}
                      className="w-16 h-8 object-cover rounded border"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{advert.title}</TableCell>
                  <TableCell>{advert.subTitle}</TableCell>
                  <TableCell className="max-w-[280px] truncate text-gray-600">
                    {advert.description}
                  </TableCell>
                  <TableCell>{advert.cta || "—"}</TableCell>
                  <TableCell className="whitespace-nowrap text-gray-600">
                    {advert.createdAt
                      ? format(new Date(advert.createdAt), "MMM d, yyyy")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAdvertToView(advert)}
                        className="h-8 w-8 p-0 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                        title="View Advert"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAdvertToEdit(advert)}
                        className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        title="Edit Advert"
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAdvertToDelete(advert)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200 transition-colors"
                        title="Delete Advert"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View — shows the advert the way the storefront hero renders it */}
      <Dialog
        open={Boolean(advertToView)}
        onOpenChange={(open) => !open && setAdvertToView(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Advert Preview</DialogTitle>
            <DialogDescription>
              How this advert appears in the homepage hero carousel.
            </DialogDescription>
          </DialogHeader>

          {advertToView && (
            <div className="space-y-4">
              <div className="relative w-full aspect-[2/1] rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={advertToView.image}
                  alt={advertToView.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
                  <p className="text-sm md:text-base font-medium text-brand-yellow">
                    {advertToView.subTitle}
                  </p>
                  <h2 className="text-2xl md:text-4xl font-bold mt-1">
                    {advertToView.title}
                  </h2>
                  <p className="mt-2 text-sm md:text-base max-w-lg text-gray-100">
                    {advertToView.description}
                  </p>
                  {advertToView.cta && (
                    <span className="mt-4 inline-block w-fit bg-brand-yellow text-black font-semibold px-5 py-2 rounded">
                      {advertToView.cta}
                    </span>
                  )}
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Created</dt>
                  <dd className="font-medium">
                    {advertToView.createdAt
                      ? format(new Date(advertToView.createdAt), "MMM d, yyyy")
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Last updated</dt>
                  <dd className="font-medium">
                    {advertToView.updatedAt
                      ? format(new Date(advertToView.updatedAt), "MMM d, yyyy")
                      : "—"}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button
              onClick={() => {
                setAdvertToEdit(advertToView);
                setAdvertToView(null);
              }}
            >
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog
        open={Boolean(advertToEdit)}
        onOpenChange={(open) => !open && setAdvertToEdit(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Advert</DialogTitle>
            <DialogDescription>
              Update the banner details. Changes go live on the homepage
              immediately.
            </DialogDescription>
          </DialogHeader>

          {advertToEdit && (
            <AdvertForm
              // Remount when switching rows so the form reseeds its state.
              key={advertToEdit._id}
              initialData={advertToEdit}
              isSubmitting={updateMutation.isPending}
              onCancel={() => setAdvertToEdit(null)}
              onSubmit={(formData) =>
                updateMutation.mutate({ id: advertToEdit._id!, formData })
              }
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={Boolean(advertToDelete)}
        onOpenChange={(open) => !open && setAdvertToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Advert</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <b>{advertToDelete?.title}</b>? It will be removed from the
              homepage carousel. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={deleteMutation.isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() =>
                advertToDelete?._id &&
                deleteMutation.mutate(advertToDelete._id)
              }
              disabled={!advertToDelete || deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdvertTable;
