"use client";

import { FormEvent, useState } from "react";
import type { AppSettings } from "@/types/menu";

export function SettingsForm({ settings }: { settings: AppSettings }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage("");
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_name: String(data.get("site_name") ?? ""),
          footer_text: String(data.get("footer_text") ?? ""),
          missing_price_text: String(data.get("missing_price_text") ?? ""),
          meta_description: String(data.get("meta_description") ?? "")
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Ayarlar kaydedilemedi.");
      setMessage("Değişiklikler kaydedildi.");
      window.dispatchEvent(new CustomEvent("wish-toast", { detail: { message: "Değişiklikler kaydedildi." } }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-card">
      <h2>Genel Ayarlar</h2>
      {message ? <div className="notice" role="status">{message}</div> : null}
      {error ? <div className="notice error" role="alert">{error}</div> : null}
      <form onSubmit={submit}>
        <div className="field-grid">
          <div className="field">
            <label htmlFor="site_name">Site adı</label>
            <input className="input" id="site_name" name="site_name" defaultValue={settings.site_name} required />
          </div>
          <div className="field">
            <label htmlFor="footer_text">Footer metni</label>
            <input className="input" id="footer_text" name="footer_text" defaultValue={settings.footer_text} required />
          </div>
          <div className="field full">
            <label htmlFor="missing_price_text">Fiyat belirtilmemiş metni</label>
            <input className="input" id="missing_price_text" name="missing_price_text" defaultValue={settings.missing_price_text} required />
          </div>
          <div className="field full">
            <label htmlFor="meta_description">Meta description</label>
            <textarea className="textarea" id="meta_description" name="meta_description" defaultValue={settings.meta_description} required />
          </div>
        </div>
        <div className="form-actions"><button className="btn" type="submit" disabled={saving}>{saving ? "KAYDEDİLİYOR..." : "DEĞİŞİKLİKLERİ KAYDET"}</button></div>
      </form>
    </section>
  );
}
