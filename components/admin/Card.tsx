import { cn } from "@/lib/utils"

type CardProps = {
    title: string
    children: React.ReactNode
    className?: string
  }
  
  export function Card({ title, children, className }: CardProps) {
    return (
      <div className={cn("bg-white rounded-lg shadow p-6", className)}>
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        {children}
      </div>
    )
  }