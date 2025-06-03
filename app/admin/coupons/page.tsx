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
const mockCoupons = [
  {
    id: "1",
    code: "SUMMER20",
    type: "percentage",
    value: "20",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    isActive: true,
    usageCount: 150,
    usageLimit: 200,
    customerLimit: 1,
  },
  {
    id: "2",
    code: "WELCOME50",
    type: "fixed_amount",
    value: "50",
    startDate: "2024-05-01",
    endDate: "2024-05-31",
    isActive: true,
    usageCount: 75,
    usageLimit: 100,
    customerLimit: 1,
  },
];

export default function CouponsPage() {
  const [coupons] = useState(mockCoupons);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Link href="/admin/coupons/new">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Coupon
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Limits</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium">{coupon.code}</TableCell>
                <TableCell>
                  {coupon.type === "percentage" ? "Percentage" : "Fixed Amount"}
                </TableCell>
                <TableCell>
                  {coupon.type === "percentage"
                    ? `${coupon.value}%`
                    : `$${coupon.value}`}
                </TableCell>
                <TableCell>
                  {format(new Date(coupon.startDate), "MMM d, yyyy")} -{" "}
                  {format(new Date(coupon.endDate), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge variant={coupon.isActive ? "default" : "secondary"}>
                    {coupon.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {coupon.usageCount} / {coupon.usageLimit}
                </TableCell>
                <TableCell>{coupon.customerLimit} per customer</TableCell>
                <TableCell>
                  <Link href={`/admin/coupons/${coupon.id}`}>
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
