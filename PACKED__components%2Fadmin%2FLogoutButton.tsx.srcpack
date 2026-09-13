"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <button className={compact ? "btn small secondary" : "admin-logout"} onClick={logout} disabled={loading} type="button">
      {loading ? "ÇIKIŞ..." : "ÇIKIŞ YAP"}
    </button>
  );
}
