"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import type { Category, Product } from "@/types/menu";

type LocalOption = { key: string; label: string; price: string };

function makeKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ProductEditor({
  categories,
  product,
  defaultCategoryId
}: {
  categories: Category[];
  product?: Product;
  defaultCategoryId?: string;
}) {
  const router = useRouter();
  const existingOptions = product?.price_options ?? [];
  const [hasOptions, setHasOptions] = useState(existingOptions.length > 0);
  const [options, setOptions] = useState<LocalOption[]>(existingOptions.map((option) => ({ key: option.id, label: option.label, price: option.price })));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isEditing = Boolean(product?.id);
  const currentPrice = useMemo(() => formatPrice(product?.price), [product?.price]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    const data = new FormData(event.currentTarget);
    if (hasOptions && options.length === 0) {
      setError("Çoklu fiyat aktifken en az bir fiyat seçeneği ekleyin.");
      setSaving(false);
      return;
    }

    const payload = {
      name: String(data.get("name") ?? ""),
      description: String(data.get("description") ?? ""),
      price: hasOptions ? null : String(data.get("price") ?? ""),
      category_id: String(data.get("category_id") ?? ""),
      spice_level: Number(data.get("spice_level") ?? 0),
      sort_order: Number(data.get("sort_order") ?? 0),
      is_active: data.get("is_active") === "on",
      note: String(data.get("note") ?? ""),
      price_options: hasOptions ? options.map(({ label, price }) => ({ label, price })) : []
    };

    try {
      const response = await fetch(isEditing ? `/api/admin/products/${product!.id}` : "/api/admin/products", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Ürün kaydedilemedi.");
      setMessage(isEditing ? "Değişiklikler kaydedildi." : "Ürün başarıyla eklendi.");
      window.dispatchEvent(new CustomEvent("wish-toast", { detail: { message: isEditing ? "Değişiklikler kaydedildi." : "Ürün başarıyla eklendi." } }));
      if (isEditing) router.refresh();
      else router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  }

  function updateOption(key: string, field: "label" | "price", value: string) {
    setOptions((current) => current.map((option) => option.key === key ? { ...option, [field]: value } : option));
  }

  return (
    <section className="admin-card">
      <h2>{isEditing ? "Ürün Bilgileri" : "Yeni Ürün"}</h2>
      {currentPrice && isEditing && !hasOptions ? <div className="current-price-box"><strong>Mevcut fiyat:</strong> {currentPrice}</div> : null}
      {message ? <div className="notice" role="status">{message}</div> : null}
      {error ? <div className="notice error" role="alert">{error}</div> : null}
      <form onSubmit={submit}>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="name">Ürün adı</label>
            <input className="input" id="name" name="name" defaultValue={product?.name ?? ""} required />
          </div>
          <div className="field">
            <label htmlFor="category_id">Kategori</label>
            <select className="select" id="category_id" name="category_id" defaultValue={product?.category_id ?? defaultCategoryId ?? ""} required>
              <option value="" disabled>Kategori seçin</option>
              {categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
            </select>
          </div>
          <div className="field full">
            <label htmlFor="description">Açıklama</label>
            <textarea className="textarea" id="description" name="description" defaultValue={product?.description ?? ""} />
          </div>
          <div className="field">
            <label htmlFor="price">{isEditing ? "Yeni fiyat" : "Ana fiyat"}</label>
            <input className="input" id="price" name="price" type="number" min="0" step="0.01" defaultValue={product?.price ?? ""} disabled={hasOptions} placeholder={hasOptions ? "Çoklu fiyat aktif" : "Örn. 395"} />
          </div>
          <div className="field">
            <label htmlFor="spice_level">Acılık seviyesi</label>
            <select className="select" id="spice_level" name="spice_level" defaultValue={product?.spice_level ?? 0}>
              <option value="0">0 — Acısız</option>
              <option value="1">1 — 🌶️</option>
              <option value="2">2 — 🌶️🌶️</option>
              <option value="3">3 — 🌶️🌶️🌶️</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="sort_order">Sıralama</label>
            <input className="input" id="sort_order" name="sort_order" type="number" min="0" defaultValue={product?.sort_order ?? 0} />
          </div>
          <div className="field">
            <label>Durum</label>
            <label className="checkbox-line"><input type="checkbox" name="is_active" defaultChecked={product?.is_active ?? true} /> Aktif</label>
          </div>
          <div className="field full">
            <label htmlFor="note">Opsiyonel not</label>
            <textarea className="textarea" id="note" name="note" defaultValue={product?.note ?? ""} />
          </div>
        </div>

        <div className="admin-card" style={{ marginTop: 18 }}>
          <label className="checkbox-line">
            <input type="checkbox" checked={hasOptions} onChange={(event) => setHasOptions(event.target.checked)} />
            Birden fazla fiyat seçeneği
          </label>
          {hasOptions ? (
            <div>
              {options.map((option, index) => (
                <div className="price-option-editor" key={option.key}>
                  <div className="field">
                    <label htmlFor={`option-label-${index}`}>Label</label>
                    <input id={`option-label-${index}`} className="input" value={option.label} onChange={(event) => updateOption(option.key, "label", event.target.value)} placeholder="5'Lİ" required />
                  </div>
                  <div className="field">
                    <label htmlFor={`option-price-${index}`}>Price</label>
                    <input id={`option-price-${index}`} className="input" type="number" min="0" step="0.01" value={option.price} onChange={(event) => updateOption(option.key, "price", event.target.value)} placeholder="385" required />
                  </div>
                  <button type="button" className="btn small danger" onClick={() => setOptions((current) => current.filter((item) => item.key !== option.key))}>Kaldır</button>
                </div>
              ))}
              <div className="form-actions"><button type="button" className="btn secondary" onClick={() => setOptions((current) => [...current, { key: makeKey(), label: "", price: "" }])}>+ Fiyat Seçeneği Ekle</button></div>
            </div>
          ) : null}
        </div>

        <div className="form-actions">
          <button className="btn" type="submit" disabled={saving}>{saving ? "KAYDEDİLİYOR..." : "DEĞİŞİKLİKLERİ KAYDET"}</button>
          <button className="btn secondary" type="button" onClick={() => router.back()}>İptal</button>
        </div>
      </form>
    </section>
  );
}
