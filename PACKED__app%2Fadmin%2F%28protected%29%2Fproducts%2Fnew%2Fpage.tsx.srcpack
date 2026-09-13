import { ProductEditor } from "@/components/admin/ProductEditor";
import { getAdminCategories } from "@/lib/db/menu";

export default async function NewProductPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const [{ category }, categories] = await Promise.all([searchParams, getAdminCategories()]);
  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-kicker">Ürün</p>
          <h1 className="admin-title">Yeni Ürün Ekle</h1>
          <p className="admin-subtitle">Ürünü herhangi bir kategoriye ekleyin; tek fiyat veya dinamik fiyat seçenekleri kullanın.</p>
        </div>
      </header>
      <ProductEditor categories={categories} defaultCategoryId={category} />
    </>
  );
}
