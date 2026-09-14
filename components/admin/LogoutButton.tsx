"use client";
import { useState } from "react";
export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function logout() {
    if (loading) return;
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) throw new Error();
      window.location.replace("/admin/login");
    } catch { setError("Çıkış yapılamadı. Lütfen tekrar deneyin."); setLoading(false); }
  }
  return <><button className={compact ? "btn small secondary" : "admin-logout"} onClick={logout} disabled={loading} type="button">{loading ? "ÇIKIŞ..." : "ÇIKIŞ YAP"}</button>{error && <p role="alert">{error}</p>}</>;
}
