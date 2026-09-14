"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { VisibilityButton } from "@/components/admin/VisibilityButton";
import type { Category } from "@/types/menu";

type AdminCategory = Category & { product_count: number };

export function CategoryManager({ categories }: { categories: AdminCategory[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function createCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage("");
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          description: String(data.get("description") ?? ""),
          sort_order: Number(data.get("sort_order") ?? categories.length + 1),
          is_active: data.get("is_active") === "on"
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Kategori eklenemedi.");
      form.reset();
      setMessage("Kategori başarıyla eklendi.");
      window.dispatchEvent(new CustomEvent("wish-toast", { detail: { message: "Kategori başarıyla eklendi." } }));
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
        <h2>Yeni Kategori</h2>
        {message ? <div className="notice" role="status">{message}</div> : null}
        {error ? <div className="notice error" role="alert">{error}</div> : null}
        <form onSubmit={createCategory}>
          <div className="field-grid">
            <div className="field">
              <label htmlFor="category-name">Kategori adı</label>
              <input id="category-name" className="input" name="name" required />
            </div>
            <div className="field">
              <label htmlFor="category-order">Sıralama numarası</label>
              <input id="category-order" className="input" name="sort_order" type="number" min="0" defaultValue={categories.length + 1} />
            </div>
            <div className="field full">
              <label htmlFor="category-description">Kategori açıklaması</label>
              <textarea id="category-description" className="textarea" name="description" />
            </div>
            <label className="checkbox-line"><input type="checkbox" name="is_active" defaultChecked /> Aktif</label>
          </div>
          <div className="form-actions"><button className="btn" type="submit" disabled={saving}>{saving ? "KAYDEDİLİYOR..." : "KATEGORİ OLUŞTUR"}</button></div>
        </form>
      </section>

      <section className="admin-card">
        <div className="admin-card-head"><h2>Kategoriler</h2><span className="muted">{categories.length} kategori</span></div>
        {categories.length ? (
          <div className="table-wrap">
            <table className="admin-table">
              <thead><tr><th>Kategori</th><th>Ürün</th><th>Sıra</th><th>Durum</th><th>İşlemler</th></tr></thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td><strong className="impact">{category.name}</strong><br/><span className="muted">/{category.slug}</span></td>
                    <td>{category.product_count}</td>
                    <td>{category.sort_order}</td>
                    <td><span className={`status ${category.is_active ? "active" : ""}`}>{category.is_active ? "Aktif" : "Pasif"}</span></td>
                    <td>
                      <div className="actions">
                        <Link className="btn small secondary" href={`/admin/categories/${category.id}`}>Düzenle</Link>
                        <VisibilityButton entity="category" id={category.id} isActive={category.is_active} />
                        <ConfirmDeleteButton
                          endpoint={`/api/admin/categories/${category.id}`}
                          title={`${category.name} kategorisini silmek istediğinizden emin misiniz?`}
                          detail={category.product_count > 0 ? `Bu kategori içerisinde ${category.product_count} ürün bulunmaktadır. Kategori silinirse bu ürünler de silinir.` : "Bu işlem geri alınamaz."}
                          label="Sil"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="empty-state">Henüz kategori bulunmuyor.</div>}
      </section>
    </>
  );
}
