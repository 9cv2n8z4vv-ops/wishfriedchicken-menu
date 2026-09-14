import "server-only";
import type { NextRequest } from "next/server";
import { getAdminFromToken } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/constants";

export async function requireApiAdmin(request: NextRequest) {
  return getAdminFromToken(request.cookies.get(SESSION_COOKIE)?.value);
}
