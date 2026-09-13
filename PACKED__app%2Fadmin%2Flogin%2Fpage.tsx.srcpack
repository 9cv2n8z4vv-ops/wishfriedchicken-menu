import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <main className="login-page">
      <section className="login-brand" aria-label="Wish Fried Chicken">
        <Image src="/wish-logo.png" alt="Wish Fried Chicken" width={758} height={1030} priority />
      </section>
      <section className="login-panel">
        <div className="login-box">
          <p className="admin-kicker">Wish Fried Chicken</p>
          <h1 className="login-title">Yönetici Girişi</h1>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
