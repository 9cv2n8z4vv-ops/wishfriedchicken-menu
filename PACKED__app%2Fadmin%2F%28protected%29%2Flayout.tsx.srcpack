import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return <AdminShell admin={admin}>{children}</AdminShell>;
}
