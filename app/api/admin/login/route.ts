import { NextResponse } from "next/server";
import { allowLogin, createSession, newSessionToken, sessionCookieOptions, verifyCredentials } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/constants";
import { assertSameOrigin } from "@/lib/security";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await request.json();
    const username = typeof body.username === "string" ? body.username : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password || username.length > 100 || password.length > 256) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    if (!(await allowLogin(request, username))) return NextResponse.json({ error: "Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin." }, { status: 429, headers: { "Retry-After": "900" } });

    const admin = await verifyCredentials(username, password);
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = newSessionToken();
    await createSession(admin.id, token);

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  } catch (error) {
    console.error("Admin login failed", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
