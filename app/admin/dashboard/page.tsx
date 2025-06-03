"use client";

import { Card } from "@/components/ui/card";
import { AreaChart } from "@/components/admin/charts/AreaChart";
import { BarChart } from "@/components/admin/charts/BarChart";
import { DonutChart } from "@/components/admin/charts/DonutChart";
import { StatsGrid } from "@/components/admin/StatsGrid";
import { TopProductsTable } from "@/components/admin/TopProductsTable";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Sales Trend</h3>
          <AreaChart />
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Sales by Region</h3>
          <DonutChart />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Monthly Revenue</h3>
          <BarChart />
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Top Selling Products</h3>
        <TopProductsTable />
      </Card>
    </div>
  );
}
