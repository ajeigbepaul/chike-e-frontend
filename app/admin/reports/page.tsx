// import { ReportCard } from '@/components/admin/ReportCard'
import { ReportCard } from '@/components/admin/ReportCard'
import Link from 'next/link'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics & Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/reports/sales">
          <ReportCard 
            title="Sales Reports" 
            description="View and export sales data"
            icon="📈"
          />
        </Link>
        
        <ReportCard 
          title="Product Performance" 
          description="Coming soon"
          icon="📊"
          disabled
        />
        
        <ReportCard 
          title="Customer Analytics" 
          description="Coming soon"
          icon="👥"
          disabled
        />
      </div>
    </div>
  )
}