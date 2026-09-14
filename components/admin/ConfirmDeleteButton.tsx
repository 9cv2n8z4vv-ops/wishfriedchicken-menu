"use client";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";

export function ConfirmDeleteButton({ endpoint, title, detail, label = "Sil" }: { endpoint: string; title: string; detail?: string; label?: string }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const noun = endpoint.includes("categories") ? "Kategori" : "Ürün";
  async function remove() {
    if (loading) return;
    setLoading(true); setError("");
    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      if (!response.ok) throw new Error("Bir hata oluştu. Lütfen tekrar deneyin.");
      dialog.current?.close();
      window.dispatchEvent(new CustomEvent("wish-toast", { detail: { message: `${noun} silindi.` } }));
      router.refresh();
    } catch { setError("Bir hata oluştu. Lütfen tekrar deneyin."); }
    finally { setLoading(false); }
  }
  return <>
    <button type="button" className="btn small danger" onClick={() => { setError(""); dialog.current?.showModal(); }}>{label}</button>
    <dialog ref={dialog} className="modal" aria-labelledby={titleId} onCancel={e => { if (loading) e.preventDefault(); }}>
      <h3 id={titleId}>{title}</h3>
      {detail && <p>{detail}</p>}
      {error && <p role="alert">{error}</p>}
      <div className="actions">
        <button type="button" autoFocus className="btn secondary" disabled={loading} onClick={() => dialog.current?.close()}>İptal</button>
        <button type="button" className="btn danger" disabled={loading} onClick={remove}>{loading ? "SİLİNİYOR..." : `${noun} sil`}</button>
      </div>
    </dialog>
  </>;
}
