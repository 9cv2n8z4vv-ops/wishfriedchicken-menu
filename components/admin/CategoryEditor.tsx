"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { VisibilityButton } from "@/components/admin/VisibilityButton";
import { productPriceSummary, spiceEmoji } from "@/lib/format";
import type { Category, Product } from "@/types/menu";

export function CategoryEditor({ category, products }: { category: Category; products: Product[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage("");
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          description: String(data.get("description") ?? ""),
          sort_order: Number(data.get("sort_order") ?? 0),
          is_active: data.get("is_active") === "on"
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Kategori kaydedilemedi.");
      setMessage("Değişiklikler kaydedildi.");
      window.dispatchEvent(new CustomEvent("wish-toast", { detail: { message: "Değişiklikler kaydedildi." } }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section className="admin-card">
        <h2>Kategori Bilgileri</h2>
        {message ? <div className="notice" role="status">{message}</div> : null}
        {error ? <div className="notice error" role="alert">{error}</div> : null}
        <form onSubmit={save}>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="name">Kategori adı</label>
              <input className="input" id="name" name="name" defaultValue={category.name} required />
            </div>
            <div className="field">
              <label htmlFor="sort_order">Sıralama</label>
              <input className="input" id="sort_order" name="sort_order" type="number" min="0" defaultValue={category.sort_order} />
            </div>
            <div className="field full">
              <label htmlFor="description">Kategori açıklaması</label>
              <textarea className="textarea" id="description" name="description" defaultValue={category.description ?? ""} />
            </div>
            <label className="checkbox-line"><input type="checkbox" name="is_active" defaultChecked={category.is_active} /> Aktif</label>
          </div>
          <div className="form-actions">
            <button className="btn" disabled={saving} type="submit">{saving ? "KAYDEDİLİYOR..." : "DEĞİŞİKLİKLERİ KAYDET"}</button>
          </div>
        </form>
      </section>

      <section className="admin-card">
        <div className="admin-card-head">
          <h2>Ürünler</h2>
          <Link className="btn small" href={`/admin/products/new?category=${category.id}`}>+ Yeni Ürün Ekle</Link>
        </div>
        {products.length ? (
          <div className="table-wrap">
            <table className="admin-table">
              <thead><tr><th>Ürün</th><th>Fiyat</th><th>Durum</th><th>İşlemler</th></tr></thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td><strong className="impact">{product.name}{product.spice_level ? ` ${spiceEmoji(product.spice_level)}` : ""}</strong></td>
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
        ) : <div className="empty-state">Bu kategoride henüz ürün bulunmuyor.</div>}
      </section>
    </>
  );
}
