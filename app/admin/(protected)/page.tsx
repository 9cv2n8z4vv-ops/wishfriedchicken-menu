import Link from "next/link";
import { getDashboardStats } from "@/lib/db/menu";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-kicker">Yönetim Paneli</p>
          <h1 className="admin-title">Menü Yönetimi</h1>
          <p className="admin-subtitle">Kategori, ürün, fiyat, görünürlük ve sıralama değişikliklerini buradan yönetin.</p>
        </div>
        <Link className="btn" href="/admin/products/new">+ Yeni Ürün Ekle</Link>
      </header>

      <section className="admin-grid" aria-label="Özet">
        <div className="stat-card"><p className="stat-label">Kategoriler</p><p className="stat-value">{stats.categories}</p></div>
        <div className="stat-card"><p className="stat-label">Aktif Kategoriler</p><p className="stat-value">{stats.active_categories}</p></div>
        <div className="stat-card"><p className="stat-label">Ürünler</p><p className="stat-value">{stats.products}</p></div>
        <div className="stat-card"><p className="stat-label">Fiyatsız Ürün</p><p className="stat-value">{stats.missing_prices}</p></div>
      </section>

      <section className="admin-card">
        <h2>Hızlı İşlemler</h2>
        <div className="actions">
          <Link className="btn secondary" href="/admin/categories">Kategorileri Yönet</Link>
          <Link className="btn secondary" href="/admin/products">Ürünleri Yönet</Link>
          <Link className="btn secondary" href="/admin/menu">Sıralamayı Düzenle</Link>
          <Link className="btn secondary" href="/" target="_blank">Public Menüyü Aç</Link>
        </div>
      </section>
    </>
  );
}
