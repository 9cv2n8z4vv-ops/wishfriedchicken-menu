import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/constants";
import { assertSameOrigin } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    await destroySession(request.cookies.get(SESSION_COOKIE)?.value);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0, httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
    return response;
  } catch (error) {
    console.error("Logout failed", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
