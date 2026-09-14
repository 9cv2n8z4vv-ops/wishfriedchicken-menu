import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireApiAdmin } from "@/lib/auth/api";
import { sql } from "@/lib/db";
import { ValidationError, assertSameOrigin, parseBoolean, parseNonNegativePrice, parseSortOrder, parseSpiceLevel } from "@/lib/security";

type PriceOptionInput = { label?: unknown; price?: unknown };

function normalizeOptions(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((raw, index) => {
    const option = raw as PriceOptionInput;
    const label = typeof option.label === "string" ? option.label.trim() : "";
    if (!label) throw new ValidationError(`Fiyat seçeneği ${index + 1} için etiket zorunludur.`);
    const price = parseNonNegativePrice(option.price);
    if (price === null) throw new ValidationError(`Fiyat seçeneği ${index + 1} için fiyat zorunludur.`);
    return { label, price };
  });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    if (!(await requireApiAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await context.params;
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const categoryId = typeof body.category_id === "string" ? body.category_id : "";
    if (!name) return NextResponse.json({ error: "Ürün adı boş olamaz." }, { status: 400 });
    if (!categoryId) return NextResponse.json({ error: "Kategori seçilmelidir." }, { status: 400 });

    const price = parseNonNegativePrice(body.price);
    const spiceLevel = parseSpiceLevel(body.spice_level ?? 0);
    const options = normalizeOptions(body.price_options);
    const [category] = await sql<{ id: string }[]>`select id from categories where id = ${categoryId} limit 1`;
    if (!category) return NextResponse.json({ error: "Kategori bulunamadı." }, { status: 400 });

    const updated = await sql.begin(async (tx) => {
      const rows = await tx`
        update products
        set category_id = ${categoryId}, name = ${name},
            description = ${typeof body.description === "string" && body.description.trim() ? body.description.trim() : null},
            price = ${price}, spice_level = ${spiceLevel}, sort_order = ${parseSortOrder(body.sort_order)},
            is_active = ${parseBoolean(body.is_active, true)},
            note = ${typeof body.note === "string" && body.note.trim() ? body.note.trim() : null}
        where id = ${id}
        returning id
      `;
      if (!rows.length) return false;
      await tx`delete from product_price_options where product_id = ${id}`;
      for (const [index, option] of options.entries()) {
        await tx`
          insert into product_price_options (product_id, label, price, sort_order)
          values (${id}, ${option.label}, ${option.price}, ${index + 1})
        `;
      }
      return true;
    });

    if (!updated) return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath(`/admin/categories/${categoryId}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Update product failed", error);
    const message = error instanceof ValidationError ? error.message : "Bir hata oluştu. Lütfen tekrar deneyin.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    if (!(await requireApiAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await context.params;
    const rows = await sql`delete from products where id = ${id} returning category_id`;
    if (!rows.length) return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete product failed", error);
    return NextResponse.json({ error: "Bir hata oluştu. Lütfen tekrar deneyin." }, { status: 500 });
  }
}
