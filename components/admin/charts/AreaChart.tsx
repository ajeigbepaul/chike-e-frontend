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
  Filler,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/services/api/admin";
import Spinner from "../../Spinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function AreaChart() {
  const { data: salesReport, isLoading } = useQuery({
    queryKey: ["salesReport", { period: "month" }],
    queryFn: () => adminApi.getSalesReport({ period: "month" }),
  });

  if (isLoading) {
    return <Spinner />;
  }

  const chartData = {
    labels: salesReport?.data.report.map(r => r.date) || [],
    datasets: [
      {
        label: "Sales",
        data: salesReport?.data.report.map(r => r.totalSales) || [],
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgb(59, 130, 246)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
