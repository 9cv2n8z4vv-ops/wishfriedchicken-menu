"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function VisibilityButton({ entity, id, isActive }: { entity: "category" | "product"; id: string; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/visibility", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity, id, is_active: !isActive })
      });
      if (!response.ok) throw new Error("Visibility update failed");
      window.dispatchEvent(new CustomEvent("wish-toast", { detail: { message: "Görünürlük güncellendi." } }));
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" className="btn small secondary" onClick={toggle} disabled={loading}>
      {loading ? "..." : isActive ? "Pasif Yap" : "Aktif Yap"}
    </button>
  );
}
