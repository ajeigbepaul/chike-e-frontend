import { PromotionForm } from "@/components/admin/PromotionForm";

export default function CreatePromotionPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Create New Promotion</h1>
      <PromotionForm />
    </div>
  );
}
