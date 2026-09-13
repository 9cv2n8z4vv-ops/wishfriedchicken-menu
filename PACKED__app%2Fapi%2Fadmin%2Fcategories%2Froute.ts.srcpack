import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireApiAdmin } from "@/lib/auth/api";
import { sql } from "@/lib/db";
import { uniqueCategorySlug } from "@/lib/db/slug";
import { assertSameOrigin, parseBoolean, parseSortOrder } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    if (!(await requireApiAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) return NextResponse.json({ error: "Kategori adı boş olamaz." }, { status: 400 });

    const slug = await uniqueCategorySlug(name);
    const [row] = await sql`
      insert into categories (name, description, slug, sort_order, is_active)
      values (
        ${name},
        ${typeof body.description === "string" && body.description.trim() ? body.description.trim() : null},
        ${slug},
        ${parseSortOrder(body.sort_order)},
        ${parseBoolean(body.is_active, true)}
      )
      returning id
    `;
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/categories");
    return NextResponse.json({ ok: true, id: row.id });
  } catch (error) {
    console.error("Create category failed", error);
    return NextResponse.json({ error: "Bir hata oluştu. Lütfen tekrar deneyin." }, { status: 500 });
  }
}
