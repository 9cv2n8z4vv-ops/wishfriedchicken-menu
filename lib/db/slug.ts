import "server-only";
import { sql } from "@/lib/db";
import { slugify } from "@/lib/format";

export async function uniqueCategorySlug(name: string, ignoreId?: string) {
  const base = slugify(name);
  for (let index = 0; index < 100; index += 1) {
    const candidate = index === 0 ? base : `${base}-${index + 1}`;
    const rows = ignoreId
      ? await sql<{ id: string }[]>`select id from categories where slug = ${candidate} and id <> ${ignoreId} limit 1`
      : await sql<{ id: string }[]>`select id from categories where slug = ${candidate} limit 1`;
    if (!rows.length) return candidate;
  }
  throw new Error("Kategori için benzersiz slug oluşturulamadı.");
}
