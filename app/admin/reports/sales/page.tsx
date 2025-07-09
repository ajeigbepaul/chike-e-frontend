"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { adminApi, SalesReportData } from "@/services/api/admin";
import { DateRangePicker } from "@/components/admin/DateRangePicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Spinner from "@/components/Spinner";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  DollarSign,
  ShoppingCart,
  Target,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PERIODS = [
  { label: "Per Day", value: "day" },
  { label: "Per Week", value: "week" },
  { label: "Per Month", value: "month" },
  { label: "Per Year", value: "year" },
];

const QUICK_PRESETS = [
  {
    label: "Last 7 Days",
    getRange: () => ({ from: subDays(new Date(), 7), to: new Date() }),
  },
  {
    label: "Last 30 Days",
    getRange: () => ({ from: subDays(new Date(), 30), to: new Date() }),
  },
  {
    label: "This Week",
    getRange: () => ({
      from: startOfWeek(new Date()),
      to: endOfWeek(new Date()),
    }),
  },
  {
    label: "This Month",
    getRange: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "This Year",
    getRange: () => ({
      from: startOfYear(new Date()),
      to: endOfYear(new Date()),
    }),
  },
];

export default function SalesReportsPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">(
    "day"
  );
  const [downloading, setDownloading] = useState(false);

  const startDate = date?.from ? format(date.from, "yyyy-MM-dd") : undefined;
  const endDate = date?.to ? format(date.to, "yyyy-MM-dd") : undefined;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["sales-report", startDate, endDate, period],
    queryFn: async () => {
      return await adminApi.getSalesReport({ startDate, endDate, period });
    },
    enabled: !!startDate && !!endDate,
  });

  const report: SalesReportData[] = data?.data?.report || [];

  // Calculate summary statistics
  const totalRevenue = report.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalSales = report.reduce((sum, item) => sum + item.totalSales, 0);
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Calculate growth (comparing first half vs second half of the period)
  const midPoint = Math.floor(report.length / 2);
  const firstHalfRevenue = report
    .slice(0, midPoint)
    .reduce((sum, item) => sum + item.totalRevenue, 0);
  const secondHalfRevenue = report
    .slice(midPoint)
    .reduce((sum, item) => sum + item.totalRevenue, 0);
  const growthPercentage =
    firstHalfRevenue > 0
      ? ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100
      : 0;

  // Chart data
  const chartData = {
    labels: report.map((r) =>
      format(
        new Date(r.date),
        period === "day"
          ? "MMM dd"
          : period === "week"
          ? "MMM dd"
          : period === "month"
          ? "MMM yyyy"
          : "yyyy"
      )
    ),
    datasets: [
      {
        label: "Revenue",
        data: report.map((r) => r.totalRevenue),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const handleQuickPreset = (preset: (typeof QUICK_PRESETS)[0]) => {
    setDate(preset.getRange());
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await adminApi.exportSalesReport({
        startDate,
        endDate,
        period,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sales_report_${startDate || "all"}_${
        endDate || "all"
      }.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sales Reports</h1>
          <p className="text-gray-600 mt-1">
            Analyze your sales performance and trends
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <Button
            onClick={handleDownload}
            disabled={downloading || report.length === 0}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            {downloading ? "Downloading..." : "Export Report"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Presets */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Quick Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPreset(preset)}
                  className="text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Date Range and Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Custom Date Range
              </label>
              <DateRangePicker date={date} onDateChange={setDate} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Group By
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="w-full border rounded-md px-3 py-2"
              >
                {PERIODS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Spinner />
            <p className="mt-2 text-gray-600">Loading sales data...</p>
          </div>
        </div>
      ) : isError ? (
        <Card>
          <CardContent className="pt-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="font-medium">Error loading sales report</p>
              <p className="text-sm mt-1">
                {error instanceof Error
                  ? error.message
                  : "An unknown error occurred."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : report.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No sales data found
              </h3>
              <p className="text-gray-600 mb-4">
                No sales data available for the selected date range and period.
              </p>
              <Button
                variant="outline"
                onClick={() =>
                  setDate({ from: subDays(new Date(), 30), to: new Date() })
                }
              >
                Try Last 30 Days
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold">
                      ${totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold">
                      {totalSales.toLocaleString()}
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Avg Order Value
                    </p>
                    <p className="text-2xl font-bold">
                      ${averageOrderValue.toLocaleString()}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Growth</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">
                        {growthPercentage.toFixed(1)}%
                      </p>
                      {growthPercentage > 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={growthPercentage > 0 ? "default" : "destructive"}
                  >
                    {growthPercentage > 0 ? "Up" : "Down"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "top" as const },
                      tooltip: {
                        callbacks: {
                          label: (context) =>
                            `Revenue: $${context.parsed.y.toLocaleString()}`,
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value: any) =>
                            `$${value.toLocaleString()}`,
                        },
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Sales Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Orders</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">
                        Avg Order Value
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.map((row) => (
                      <TableRow key={row.date}>
                        <TableCell className="font-medium">
                          {format(
                            new Date(row.date),
                            period === "day"
                              ? "MMM dd, yyyy"
                              : period === "week"
                              ? "MMM dd, yyyy"
                              : period === "month"
                              ? "MMMM yyyy"
                              : "yyyy"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {row.totalSales.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${row.totalRevenue.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${row.averageOrderValue.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
