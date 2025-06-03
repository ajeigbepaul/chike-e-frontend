"use client";
import { DateRangePicker } from "@/components/admin/DateRangePicker";
import { SalesReport } from "@/components/admin/SalesReport";
import { useRouter, useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";

export default function SalesReportsPage({
  searchParams,
}: {
  searchParams?: { from?: string; to?: string };
}) {
  const router = useRouter();
  const searchParams2 = useSearchParams();

  const date: DateRange | undefined = searchParams?.from
    ? {
        from: new Date(searchParams.from),
        to: searchParams.to ? new Date(searchParams.to) : undefined,
      }
    : undefined;

  const handleDateChange = (newDate: DateRange | undefined) => {
    const params = new URLSearchParams(searchParams2);
    if (newDate?.from) {
      params.set("from", newDate.from.toISOString());
      if (newDate.to) {
        params.set("to", newDate.to.toISOString());
      }
    } else {
      params.delete("from");
      params.delete("to");
    }
    router.push(`/admin/reports/sales?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales Reports</h1>
        <DateRangePicker date={date} onDateChange={handleDateChange} />
      </div>

      <SalesReport fromDate={searchParams?.from} toDate={searchParams?.to} />
    </div>
  );
}
