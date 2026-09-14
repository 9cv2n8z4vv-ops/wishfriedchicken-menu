import Link from "next/link";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { VisibilityButton } from "@/components/admin/VisibilityButton";
import { getAllProducts } from "@/lib/db/menu";
import { productPriceSummary, spiceEmoji } from "@/lib/format";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const products = await getAllProducts(q);

  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-kicker">İçerik</p>
          <h1 className="admin-title">Ürünler</h1>
          <p className="admin-subtitle">Ürün adı, açıklama, fiyat, acılık, kategori ve görünürlük bilgilerini yönetin.</p>
        </div>
        <Link className="btn" href="/admin/products/new">+ Yeni Ürün Ekle</Link>
      </header>

      <section className="admin-card">
        <form className="search-form" action="/admin/products" method="get">
          <label className="sr-only" htmlFor="product-search">Ürün ara</label>
          <input id="product-search" className="input" type="search" name="q" defaultValue={q} placeholder="Örn. korean" />
          <button className="btn" type="submit">Ara</button>
          {q ? <Link className="btn secondary" href="/admin/products">Temizle</Link> : null}
        </form>
      </section>

      <section className="admin-card">
        <div className="admin-card-head"><h2>Ürün Listesi</h2><span className="muted">{products.length} sonuç</span></div>
        {products.length ? (
          <div className="table-wrap">
            <table className="admin-table">
              <thead><tr><th>Ürün</th><th>Kategori</th><th>Fiyat</th><th>Durum</th><th>İşlemler</th></tr></thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td><strong className="impact">{product.name}{product.spice_level ? ` ${spiceEmoji(product.spice_level)}` : ""}</strong><br/>{product.description ? <span className="muted">{product.description}</span> : null}</td>
                    <td>{product.category_name}</td>
                    <td>{productPriceSummary(product)}</td>
                    <td><span className={`status ${product.is_active ? "active" : ""}`}>{product.is_active ? "Aktif" : "Pasif"}</span></td>
                    <td><div className="actions">
                      <Link className="btn small secondary" href={`/admin/products/${product.id}`}>Düzenle</Link>
                      <VisibilityButton entity="product" id={product.id} isActive={product.is_active} />
                      <ConfirmDeleteButton endpoint={`/api/admin/products/${product.id}`} title={`${product.name} ürününü silmek istediğinizden emin misiniz?`} detail="Bu işlem geri alınamaz." />
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="empty-state">Aramanıza uygun ürün bulunamadı.</div>}
      </section>
    </>
  );
}
