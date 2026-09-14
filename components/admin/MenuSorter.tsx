"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Product } from "@/types/menu";
type Cat = Category & { product_count: number };
type Prod = Product & { category_name: string };
function move<T>(rows: T[], from: number, to: number) {
  const next = [...rows]; const [item] = next.splice(from, 1); next.splice(to, 0, item); return next;
}
export function MenuSorter({ categories: initial, products }: { categories: Cat[]; products: Prod[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [active, setActive] = useState(initial[0]?.id || "");
  const [orders, setOrders] = useState<Record<string, Prod[]>>(() => Object.fromEntries(initial.map(c => [c.id, products.filter(p => p.category_id === c.id)])));
  const [drag, setDrag] = useState<{ type: string; index: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  function reorder(type: "categories" | "products", from: number, to: number) {
    if (saving || from === to) return;
    if (type === "categories") setCategories(move(categories, from, to));
    else setOrders({ ...orders, [active]: move(orders[active] || [], from, to) });
    setDirty(true); setMessage(""); setDrag(null);
  }
  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      const response = await fetch("/api/admin/reorder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ categories: categories.map(c => c.id), products: Object.fromEntries(Object.entries(orders).map(([id, rows]) => [id, rows.map(p => p.id)])) }) });
      if (!response.ok) throw new Error();
      setDirty(false); setMessage("Değişiklikler kaydedildi."); router.refresh();
      window.dispatchEvent(new CustomEvent("wish-toast", { detail: { message: "Değişiklikler kaydedildi." } }));
    } catch { setMessage("Sıralama kaydedilemedi. Lütfen tekrar deneyin."); }
    finally { setSaving(false); }
  }
  function rows(type: "categories" | "products", items: (Cat | Prod)[]) {
    return <div className="sort-list">{items.map((item, index) => <div className="sort-item" key={item.id} draggable={!saving}
      onDragStart={() => setDrag({ type, index })} onDragEnd={() => setDrag(null)} onDragOver={e => e.preventDefault()}
      onDrop={() => { if (drag?.type === type) reorder(type, drag.index, index); }}>
      {type === "categories" ? <button type="button" className={`sort-category-button ${active === item.id ? "is-active" : ""}`} onClick={() => setActive(item.id)}>{item.name}</button> : <strong className="impact">{item.name}</strong>}
      <div className="sort-controls"><button type="button" className="btn secondary small" aria-label={`${item.name} yukarı taşı`} disabled={saving || index === 0} onClick={() => reorder(type, index, index - 1)}>↑</button><button type="button" className="btn secondary small" aria-label={`${item.name} aşağı taşı`} disabled={saving || index === items.length - 1} onClick={() => reorder(type, index, index + 1)}>↓</button></div>
    </div>)}</div>;
  }
  return <section className="admin-card"><h2>Menü sıralaması</h2><p className="muted">Sürükleyin veya okları kullanın. Bitirdiğinizde değişiklikleri kaydedin.</p><p role="status">{message}</p>
    <div className="sorter-columns"><div><h3>Kategoriler</h3>{rows("categories", categories)}</div><div><h3>{categories.find(c => c.id === active)?.name} — Ürünler</h3>{orders[active]?.length ? rows("products", orders[active]) : <p className="empty-state">Bu kategoride henüz ürün bulunmuyor.</p>}</div></div>
    <div className="form-actions"><button type="button" className="btn" disabled={saving || !dirty} onClick={save}>{saving ? "KAYDEDİLİYOR..." : "DEĞİŞİKLİKLERİ KAYDET"}</button></div>
  </section>;
}
