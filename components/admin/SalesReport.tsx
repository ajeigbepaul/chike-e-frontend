"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Doughnut } from "react-chartjs-2";
import { ArcElement } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type SalesReportProps = {
  fromDate?: string;
  toDate?: string;
};

export function SalesReport({ fromDate, toDate }: SalesReportProps) {
  console.log(fromDate,toDate)
  // Mock data - replace with your API data
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [12000, 19000, 3000, 5000, 2000, 3000],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: ["Electronics", "Clothing", "Food", "Books"],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: [
          "rgba(59, 130, 246, 0.5)",
          "rgba(16, 185, 129, 0.5)",
          "rgba(245, 158, 11, 0.5)",
          "rgba(239, 68, 68, 0.5)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const topProducts = [
    { name: "Product A", sales: 1200, revenue: 24000 },
    { name: "Product B", sales: 980, revenue: 19600 },
    { name: "Product C", sales: 850, revenue: 17000 },
    { name: "Product D", sales: 720, revenue: 14400 },
    { name: "Product E", sales: 650, revenue: 13000 },
  ];

  return (
    <div className="space-y-6">
      {/* Sales Trend Section */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Sales Trend</h3>
        <div className="h-[400px]">
          <Line
            data={salesData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top" as const,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `$${value.toLocaleString()}`,
                  },
                },
              },
            }}
          />
        </div>
      </Card>

      {/* Bottom Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Section */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Top Products</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {product.sales.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ${product.revenue.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Revenue by Category Section */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Revenue by Category</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right" as const,
                  },
                },
              }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
