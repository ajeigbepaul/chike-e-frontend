"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/services/api/admin";
import Spinner from "../../Spinner";

ChartJS.register(ArcElement, Tooltip, Legend);

export function DonutChart() {
  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: adminApi.getDashboardStats,
  });

  if (isLoading) {
    return <Spinner />;
  }

  const chartData = {
    labels: dashboardStats?.salesByRegion?.map(r => r.region) || [],
    datasets: [
      {
        data: dashboardStats?.salesByRegion?.map(r => r.totalSales) || [],
        backgroundColor: [
          "rgba(59, 130, 246, 0.5)",
          "rgba(16, 185, 129, 0.5)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
        ],
        borderWidth: 1,
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

  return <Doughnut data={chartData} options={options} />;
}
