import "server-only";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { DEFAULT_SESSION_HOURS, SESSION_COOKIE } from "@/lib/constants";
import type { AdminUser } from "@/types/menu";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function sessionHours() {
  const configured = Number(process.env.ADMIN_SESSION_HOURS ?? DEFAULT_SESSION_HOURS);
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_SESSION_HOURS;
}

export function newSessionToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: sessionHours() * 60 * 60
  };
}

export async function verifyCredentials(username: string, password: string): Promise<AdminUser | null> {
  const [user] = await sql<(AdminUser & { password_hash: string })[]>`
    select id, username, password_hash
    from admin_users
    where username = ${username.trim()}
    limit 1
  `;
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return null;
  return { id: user.id, username: user.username };
}

export async function createSession(userId: string, token: string) {
  const tokenHash = hashToken(token);
  const hours = sessionHours();
  await sql.begin(async (tx) => {
    await tx`delete from admin_sessions where expires_at <= now()`;
    await tx`
      insert into admin_sessions (admin_user_id, token_hash, expires_at)
      values (${userId}, ${tokenHash}, now() + (${hours}::text || ' hours')::interval)
    `;
  });
}

export async function destroySession(token: string | undefined) {
  if (!token) return;
  await sql`delete from admin_sessions where token_hash = ${hashToken(token)}`;
}

export async function getAdminFromToken(token: string | undefined): Promise<AdminUser | null> {
  if (!token) return null;
  const [admin] = await sql<AdminUser[]>`
    select u.id, u.username
    from admin_sessions s
    join admin_users u on u.id = s.admin_user_id
    where s.token_hash = ${hashToken(token)} and s.expires_at > now()
    limit 1
  `;
  return admin ?? null;
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  return getAdminFromToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
