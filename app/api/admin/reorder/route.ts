import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireApiAdmin } from "@/lib/auth/api";
import { sql } from "@/lib/db";
import { assertSameOrigin } from "@/lib/security";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function validIds(value: unknown): value is string[] { return Array.isArray(value) && value.length <= 2000 && value.every(v => typeof v === "string" && uuid.test(v)) && new Set(value).size === value.length; }
export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    if (!(await requireApiAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body: { categories?: unknown; products?: unknown } = await request.json();
    if (!validIds(body.categories) || !body.products || typeof body.products !== "object" || Array.isArray(body.products)) return NextResponse.json({ error: "Geçersiz sıralama." }, { status: 400 });
    const categories = body.categories;
    const groups = Object.entries(body.products);
    if (groups.some(([id, values]) => !uuid.test(id) || !validIds(values))) return NextResponse.json({ error: "Geçersiz sıralama." }, { status: 400 });
    await sql.begin(async tx => {
      for (const [i, id] of categories.entries()) {
        const rows = await tx`update categories set sort_order = ${i + 1} where id = ${id} returning id`;
        if (!rows.length) throw new Error("Stale category order");
      }
      for (const [categoryId, values] of groups) for (const [i, id] of (values as string[]).entries()) {
        const rows = await tx`update products set sort_order = ${i + 1} where id = ${id} and category_id = ${categoryId} returning id`;
        if (!rows.length) throw new Error("Stale product order");
      }
    });
    revalidatePath("/"); revalidatePath("/admin", "layout");
    return NextResponse.json({ ok: true });
  } catch (error) { console.error("Reorder failed", error); return NextResponse.json({ error: "Sıralama kaydedilemedi. Sayfayı yenileyip tekrar deneyin." }, { status: 400 }); }
}
