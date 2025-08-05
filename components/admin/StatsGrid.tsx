import { cn } from '@/lib/utils'
import { ArrowUp, ArrowDown, DollarSign, ShoppingCart, Package, Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/services/api/admin'
import Spinner from '../Spinner'

export function StatsGrid() {
  const { data: dashboardStats, isLoading, isError } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: adminApi.getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow">
            <Spinner />
          </div>
        ))}
      </div>
    )
  }

  if (isError || !dashboardStats) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Failed to load dashboard statistics
      </div>
    )
  }

  const stats = [
    {
      name: 'Today Sales',
      value: `$${(dashboardStats.todaySales?.total || 0).toLocaleString()}`,
      change: '0%', // You can calculate this based on previous day data
      trend: 'up' as const,
      icon: DollarSign,
      count: dashboardStats.todaySales?.count || 0
    },
    {
      name: 'Pending Orders',
      value: dashboardStats.pendingOrders?.toString() || '0',
      change: '0%', // You can calculate this based on previous period
      trend: 'down' as const,
      icon: ShoppingCart,
    },
    {
      name: 'Low Stock',
      value: dashboardStats.lowStockProducts?.toString() || '0',
      change: '0%', // You can calculate this based on previous period
      trend: 'up' as const,
      icon: Package,
    },
    {
      name: 'Total Users',
      value: dashboardStats.totalUsers?.toString() || '0',
      change: '0%', // You can calculate this based on previous period
      trend: 'up' as const,
      icon: Users,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                {stat.count !== undefined && (
                  <p className="text-xs text-gray-400 mt-1">{stat.count} orders</p>
                )}
              </div>
              <div className="flex flex-col items-end">
                <Icon className="h-8 w-8 text-gray-400 mb-2" />
                <div className={cn(
                  "flex items-center text-xs",
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                )}>
                  {stat.trend === 'up' ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  <span className="ml-1">{stat.change}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
