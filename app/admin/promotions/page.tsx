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
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

// Mock data - replace with actual API call
const mockPromotions = [
  {
    id: "1",
    name: "Summer Sale",
    type: "percentage",
    value: "20",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    isActive: true,
    usageCount: 150,
  },
  {
    id: "2",
    name: "Clearance Discount",
    type: "fixed_amount",
    value: "50",
    startDate: "2024-05-01",
    endDate: "2024-05-31",
    isActive: true,
    usageCount: 75,
  },
];

export default function PromotionsPage() {
  const [promotions] = useState(mockPromotions);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Promotions</h1>
        <Link href="/admin/promotions/new">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Promotion
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell>{promotion.name}</TableCell>
                <TableCell>
                  {promotion.type === "percentage"
                    ? "Percentage"
                    : "Fixed Amount"}
                </TableCell>
                <TableCell>
                  {promotion.type === "percentage"
                    ? `${promotion.value}%`
                    : `$${promotion.value}`}
                </TableCell>
                <TableCell>
                  {format(new Date(promotion.startDate), "MMM d, yyyy")} -{" "}
                  {format(new Date(promotion.endDate), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge variant={promotion.isActive ? "default" : "secondary"}>
                    {promotion.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{promotion.usageCount} uses</TableCell>
                <TableCell>
                  <Link href={`/admin/promotions/${promotion.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
