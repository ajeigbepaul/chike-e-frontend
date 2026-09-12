"use client";

import { useMemo, useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { PlusIcon, RefreshCw, Search as SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import advertService, { type Advert } from "@/services/api/advert";
import AdvertTable from "@/components/admin/AdvertTable";
import AdvertForm from "./components/AdvertForm";

/** The service returns raw axios errors, so dig out the server message first. */
const getErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message || error?.message || fallback;

const AdvertPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["adverts"],
    queryFn: advertService.getAllAdverts,
  });

  const adverts: Advert[] = useMemo(() => data?.data ?? [], [data]);

  const filteredAdverts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return adverts;
    return adverts.filter(
      (advert) =>
        advert.title?.toLowerCase().includes(term) ||
        advert.subTitle?.toLowerCase().includes(term) ||
        advert.description?.toLowerCase().includes(term)
    );
  }, [adverts, search]);

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => advertService.createAdvert(formData),
    onSuccess: () => {
      toast.success("Advert created successfully");
      // Same key the storefront hero uses, so the homepage refreshes too.
      queryClient.invalidateQueries({ queryKey: ["adverts"] });
      setIsCreateOpen(false);
    },
    onError: (err: any) => {
      toast.error(getErrorMessage(err, "Failed to create advert"));
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Adverts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the banners shown in the homepage hero carousel.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Advert
          </Button>
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center justify-between">
          <span>
            {getErrorMessage(error, "Failed to load adverts")}
          </span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}

      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search adverts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <AdvertTable adverts={filteredAdverts} isLoading={isLoading} />

      {!isLoading && adverts.length > 0 && (
        <p className="text-sm text-gray-500">
          Showing {filteredAdverts.length} of {adverts.length} advert
          {adverts.length === 1 ? "" : "s"}
        </p>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Advert</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new homepage advert banner.
            </DialogDescription>
          </DialogHeader>
          <AdvertForm
            isSubmitting={createMutation.isPending}
            onCancel={() => setIsCreateOpen(false)}
            onSubmit={(formData) => createMutation.mutate(formData)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvertPage;
