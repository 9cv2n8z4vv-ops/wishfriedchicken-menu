import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireApiAdmin } from "@/lib/auth/api";
import { sql } from "@/lib/db";
import { assertSameOrigin } from "@/lib/security";

export async function PATCH(request: NextRequest) {
  try {
    assertSameOrigin(request);
    if (!(await requireApiAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";
    const isActive = typeof body.is_active === "boolean" ? body.is_active : null;
    if (!id || isActive === null || (body.entity !== "category" && body.entity !== "product")) {
      return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
    }

    if (body.entity === "category") {
      await sql`update categories set is_active = ${isActive} where id = ${id}`;
    } else {
      await sql`update products set is_active = ${isActive} where id = ${id}`;
    }
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/admin/menu");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Visibility update failed", error);
    return NextResponse.json({ error: "Bir hata oluştu. Lütfen tekrar deneyin." }, { status: 500 });
  }
}
