import { SessionGuard } from "./SessionGuard";
import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { AdminToastHub } from "@/components/admin/AdminToastHub";
import type { AdminUser } from "@/types/menu";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/categories", "Kategoriler"],
  ["/admin/products", "Ürünler"],
  ["/admin/menu", "Menü Düzenleme"],
  ["/admin/settings", "Genel Ayarlar"]
] as const;

export function AdminShell({ admin, children }: { admin: AdminUser; children: React.ReactNode }) {
  return (
    <div className="admin-body">
      <AdminToastHub /><SessionGuard />
      <div className="admin-mobile-header">
        <Image src="/wish-logo.png" alt="Wish Fried Chicken" width={758} height={1030} />
        <details className="admin-mobile-menu">
          <summary>Menü</summary>
          <div className="admin-mobile-links">
            {links.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}
            <LogoutButton compact />
          </div>
        </details>
      </div>
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <Link href="/admin" aria-label="Admin ana sayfa">
            <Image className="admin-sidebar-logo" src="/wish-logo.png" alt="Wish Fried Chicken" width={758} height={1030} priority />
          </Link>
          <nav className="admin-nav" aria-label="Admin navigasyonu">
            {links.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}
          </nav>
          <div className="admin-sidebar-bottom">
            <div className="admin-user">Giriş: <strong>{admin.username}</strong></div>
            <LogoutButton />
          </div>
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
