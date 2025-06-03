import Link from "next/link";
import { Button } from "@/components/ui/button";

type UserRoleFilterProps = {
  role?: string;
};

export function UserRoleFilter({ role }: UserRoleFilterProps) {
  return (
    <div className="flex space-x-2">
      <Button variant={!role ? "default" : "outline"} asChild>
        <Link href="/admin/users">All</Link>
      </Button>
      <Button variant={role === "admin" ? "default" : "outline"} asChild>
        <Link href="/admin/users?role=admin">Admins</Link>
      </Button>
      <Button variant={role === "customer" ? "default" : "outline"} asChild>
        <Link href="/admin/users?role=customer">Customers</Link>
      </Button>
      <Button variant={role === "vendor" ? "default" : "outline"} asChild>
        <Link href="/admin/users?role=vendor">Vendors</Link>
      </Button>
    </div>
  );
}
