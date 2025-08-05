"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/services/api/admin";
import Spinner from "../../Spinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function BarChart() {
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
        label: "Revenue",
        data: salesReport?.data.report.map(r => r.totalRevenue) || [],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
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

  return <Bar data={chartData} options={options} />;
}
