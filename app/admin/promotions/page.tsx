"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllPromotions } from "@/services/api/promotion";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function PromotionsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["promotions"],
    queryFn: getAllPromotions,
  });
const { mutate: deletePromotionMutate } = useMutation({
    mutationFn: async (id:string) =>
      await import("@/services/api/promotion").then((mod) =>
        mod.deletePromotion(id)
      ),
    onSuccess: () => {
      toast.success("Promotion deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete promotion");
    },
  });
  if (isLoading) return <div>Loading promotions...</div>;
  if (isError) return <div>Error loading promotions.</div>;

  const promotions = data?.data?.promotions || [];

  // Helper to check if promotion is expired
  interface Promotion {
    _id: string;
    name: string;
    type: string;
    value: number;
    startDate: string;
    endDate?: string;
    isActive: boolean;
    applicableTo: string;
  }

  const isPromotionExpired = (promotion: Promotion): boolean => {
    if (!promotion.endDate) return false;
    return new Date() > new Date(promotion.endDate);
  };
  // Delete mutation
  

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Promotions</h1>
        <Link href="/admin/promotions/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Promotion
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Promotions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Applicable To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promotion) => (
                <TableRow key={promotion._id}>
                  <TableCell className="font-medium">
                    {promotion.name}
                  </TableCell>
                  <TableCell>{promotion.type}</TableCell>
                  <TableCell>{promotion.value}</TableCell>
                  <TableCell>
                    {format(new Date(promotion.startDate), "PPP")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(promotion.endDate), "PPP")}
                  </TableCell>
                  <TableCell>{promotion.isActive ? "Yes" : "No"}</TableCell>
                  <TableCell>{promotion.applicableTo}</TableCell>
                  <TableCell>
                    <Link href={`/admin/promotions/${promotion._id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <button
                      className="ml-2 cursor-pointer text-white hover:text-gray-100 bg-red-400 p-1 rounded-lg"
                      onClick={() => deletePromotionMutate(promotion._id)}
                    >
                      Delete
                    </button>
                  </TableCell>
                  {isPromotionExpired(promotion) && (
                    <TableCell>
                      <span className="text-red-500 font-semibold ml-2">
                        Deactivated
                      </span>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
