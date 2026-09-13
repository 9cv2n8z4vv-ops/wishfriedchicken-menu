"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Product } from "@/types/menu";

type AdminCategory = Category & { product_count: number };
type AdminProduct = Product & { category_name: string };

function move<T>(items: T[], from: number, to: number) {
  const copy = [...items];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function MenuSorter({ categories: initialCategories, products }: { categories: AdminCategory[]; products: AdminProduct[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [activeCategoryId, setActiveCategoryId] = useState(initialCategories[0]?.id ?? "");
  const [productOrders, setProductOrders] = useState<Record<string, AdminProduct[]>>(() => {
    const grouped: Record<string, AdminProduct[]> = {};
    for (const category of initialCategories) grouped[category.id] = [];
    for (const product of products) (grouped[product.category_id] ??= []).push(product);
    return grouped;
  });
  const [dragCategory, setDragCategory] = useState<number | null>(null);
  const [dragProduct, setDragProduct] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const activeCategory = useMemo(() => categories.find((category) => category.id === activeCategoryId), [categories, activeCategoryId]);
  const activeProducts = productOrders[activeCategoryId] ?? [];

  async function persist(type: "categories" | "products", ids: string[]) {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ids })
      });
      if (!response.ok) throw new Error("Sıralama kaydedilemedi.");
      setMessage("Sıralama kaydedildi.");
      window.dispatchEvent(new CustomEvent("wish-toast", { detail: { message: "Sıralama kaydedildi." } }));
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  }

  function dropCategory(targetIndex: number) {
    if (dragCategory === null || dragCategory === targetIndex) return;
    const next = move(categories, dragCategory, targetIndex);
    setCategories(next);
    setDragCategory(null);
    void persist("categories", next.map((category) => category.id));
  }

  function dropProduct(targetIndex: number) {
    if (dragProduct === null || dragProduct === targetIndex) return;
    const next = move(activeProducts, dragProduct, targetIndex);
    setProductOrders((current) => ({ ...current, [activeCategoryId]: next }));
    setDragProduct(null);
    void persist("products", next.map((product) => product.id));
  }

  return (
    <section className="admin-card">
      <div className="admin-card-head">
        <h2>Sürükle & Bırak Sıralama</h2>
        <span className="muted">{saving ? "Kaydediliyor..." : message}</span>
      </div>
      <div className="sorter-columns">
        <div>
          <h3>Kategoriler</h3>
          <div className="sort-list">
            {categories.map((category, index) => (
              <div
                className={`sort-item ${dragCategory === index ? "is-dragging" : ""}`}
                key={category.id}
                draggable
                onDragStart={() => setDragCategory(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => dropCategory(index)}
              >
                <span className="drag-handle" aria-hidden="true">☰</span>
                <button className={`sort-category-button ${activeCategoryId === category.id ? "is-active" : ""}`} type="button" onClick={() => setActiveCategoryId(category.id)}>
                  {category.name}
                </button>
                <span className="muted">{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3>{activeCategory?.name ?? "Ürünler"} — Ürün Sırası</h3>
          {activeProducts.length ? (
            <div className="sort-list">
              {activeProducts.map((product, index) => (
                <div
                  className={`sort-item ${dragProduct === index ? "is-dragging" : ""}`}
                  key={product.id}
                  draggable
                  onDragStart={() => setDragProduct(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => dropProduct(index)}
                >
                  <span className="drag-handle" aria-hidden="true">☰</span>
                  <strong className="impact">{product.name}</strong>
                  <span className="muted">{index + 1}</span>
                </div>
              ))}
            </div>
          ) : <div className="empty-state">Bu kategoride henüz ürün bulunmuyor.</div>}
        </div>
      </div>
    </section>
  );
}
