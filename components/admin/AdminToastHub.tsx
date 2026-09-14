"use client";

import { useEffect, useState } from "react";

export function AdminToastHub() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    function handler(event: Event) {
      const custom = event as CustomEvent<{ message?: string }>;
      if (!custom.detail?.message) return;
      setMessage(custom.detail.message);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setMessage(""), 2600);
    }
    window.addEventListener("wish-toast", handler);
    return () => {
      window.removeEventListener("wish-toast", handler);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return message ? <div className="admin-toast" role="status">{message}</div> : null;
}
