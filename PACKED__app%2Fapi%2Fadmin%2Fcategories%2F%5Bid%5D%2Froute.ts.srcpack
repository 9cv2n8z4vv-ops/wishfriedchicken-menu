import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireApiAdmin } from "@/lib/auth/api";
import { sql } from "@/lib/db";
import { uniqueCategorySlug } from "@/lib/db/slug";
import { assertSameOrigin, parseBoolean, parseSortOrder } from "@/lib/security";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    if (!(await requireApiAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await context.params;
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) return NextResponse.json({ error: "Kategori adı boş olamaz." }, { status: 400 });
    const slug = await uniqueCategorySlug(name, id);

    const rows = await sql`
      update categories
      set name = ${name},
          description = ${typeof body.description === "string" && body.description.trim() ? body.description.trim() : null},
          slug = ${slug},
          sort_order = ${parseSortOrder(body.sort_order)},
          is_active = ${parseBoolean(body.is_active, true)}
      where id = ${id}
      returning id
    `;
    if (!rows.length) return NextResponse.json({ error: "Kategori bulunamadı." }, { status: 404 });
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/categories");
    revalidatePath(`/admin/categories/${id}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Update category failed", error);
    return NextResponse.json({ error: "Bir hata oluştu. Lütfen tekrar deneyin." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    if (!(await requireApiAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await context.params;
    const rows = await sql`delete from categories where id = ${id} returning id`;
    if (!rows.length) return NextResponse.json({ error: "Kategori bulunamadı." }, { status: 404 });
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/categories");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete category failed", error);
    return NextResponse.json({ error: "Bir hata oluştu. Lütfen tekrar deneyin." }, { status: 500 });
  }
}
