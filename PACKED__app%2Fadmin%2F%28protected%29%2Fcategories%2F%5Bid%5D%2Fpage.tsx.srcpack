import { notFound } from "next/navigation";
import { CategoryEditor } from "@/components/admin/CategoryEditor";
import { getCategoryById } from "@/lib/db/menu";

export default async function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) notFound();

  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-kicker">Kategori Detayı</p>
          <h1 className="admin-title">{category.name}</h1>
          <p className="admin-subtitle">Kategori bilgilerini ve bu kategoriye bağlı ürünleri yönetin.</p>
        </div>
      </header>
      <CategoryEditor category={category} products={category.products} />
    </>
  );
}
