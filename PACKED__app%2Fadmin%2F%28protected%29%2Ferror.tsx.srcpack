"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="admin-card">
      <h2>Bir hata oluştu</h2>
      <p className="muted">İşlem tamamlanamadı. Lütfen bağlantıyı kontrol edip tekrar deneyin.</p>
      <button className="btn" type="button" onClick={reset}>Tekrar Dene</button>
    </div>
  );
}
