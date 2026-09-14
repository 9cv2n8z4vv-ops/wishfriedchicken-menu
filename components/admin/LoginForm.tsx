"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: String(form.get("username") ?? ""),
          password: String(form.get("password") ?? "")
        })
      });

      if (!response.ok) {
        setError(response.status === 429 ? "Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin." : response.status === 401 ? "Kullanıcı adı veya şifre hatalı." : "Bir hata oluştu. Lütfen tekrar deneyin.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-form" onSubmit={submit}>
      {error ? <div className="notice error" role="alert">{error}</div> : null}
      <div className="field">
        <label htmlFor="username">Kullanıcı adı</label>
        <input className="input" id="username" name="username" autoComplete="username" required />
      </div>
      <div className="field">
        <label htmlFor="password">Şifre</label>
        <div className="password-wrap">
          <input
            className="input"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
          />
          <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)}>
            {showPassword ? "Gizle" : "Göster"}
          </button>
        </div>
      </div>
      <button className="btn" type="submit" disabled={loading}>
        {loading ? "GİRİŞ YAPILIYOR..." : "GİRİŞ YAP"}
      </button>
    </form>
  );
}
