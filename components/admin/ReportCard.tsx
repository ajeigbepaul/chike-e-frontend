import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ReportCardProps = {
  title: string;
  description: string;
  icon: string;
  disabled?: boolean;
};

export function ReportCard({
  title,
  description,
  icon,
  disabled,
}: ReportCardProps) {
  return (
    <Card
      className={cn(
        "transition-colors hover:bg-muted/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
