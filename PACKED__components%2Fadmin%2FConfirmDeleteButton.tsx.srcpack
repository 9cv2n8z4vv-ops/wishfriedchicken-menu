"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ConfirmDeleteButton({
  endpoint,
  title,
  detail,
  label = "Sil"
}: {
  endpoint: string;
  title: string;
  detail?: string;
  label?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function confirmDelete() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Silme işlemi başarısız.");
      }
      setOpen(false);
      window.dispatchEvent(new CustomEvent("wish-toast", { detail: { message: "Kayıt silindi." } }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button type="button" className="btn small danger" onClick={() => setOpen(true)}>{label}</button>
      {open ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.currentTarget === e.target && setOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <h3 id="delete-title">{title}</h3>
            {detail ? <p>{detail}</p> : null}
            {error ? <div className="notice error" role="alert">{error}</div> : null}
            <div className="actions">
              <button type="button" className="btn secondary" onClick={() => setOpen(false)} disabled={loading}>İptal</button>
              <button type="button" className="btn danger" onClick={confirmDelete} disabled={loading}>{loading ? "SİLİNİYOR..." : "SİL"}</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
