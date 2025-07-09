"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllPromotions } from "@/services/api/promotion";
import { format } from "date-fns";

export default function PromotionsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["promotions"],
    queryFn: getAllPromotions,
  });

  if (isLoading) return <div>Loading promotions...</div>;
  if (isError) return <div>Error loading promotions.</div>;

  const promotions = data?.data?.promotions || [];

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
                  <TableCell className="font-medium">{promotion.name}</TableCell>
                  <TableCell>{promotion.type}</TableCell>
                  <TableCell>{promotion.value}</TableCell>
                  <TableCell>{format(new Date(promotion.startDate), "PPP")}</TableCell>
                  <TableCell>{format(new Date(promotion.endDate), "PPP")}</TableCell>
                  <TableCell>{promotion.isActive ? "Yes" : "No"}</TableCell>
                  <TableCell>{promotion.applicableTo}</TableCell>
                  <TableCell>
                    <Link href={`/admin/promotions/${promotion._id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}