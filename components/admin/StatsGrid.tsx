import { cn } from '@/lib/utils'
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react'

export function StatsGrid() {
  const stats = [
    { name: 'Today Sales', value: '$2,450', change: '+12%', trend: 'up' },
    { name: 'Pending Orders', value: '24', change: '-2%', trend: 'down' },
    { name: 'Low Stock', value: '5', change: '+3', trend: 'up' },
    { name: 'New Customers', value: '18', change: '+30%', trend: 'up' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-semibold mt-1">{stat.value}</p>
            </div>
            <div className={cn(
              "flex items-center",
              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
            )}>
              {stat.trend === 'up' ? (
                <ArrowUp className="h-5 w-5" />
              ) : (
                <ArrowDown className="h-5 w-5" />
              )}
              <span className="ml-1 text-sm">{stat.change}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}