import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { getAdminCategories, getProductById } from "@/lib/db/menu";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getAdminCategories()]);
  if (!product) notFound();

  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-kicker">Ürün Düzenleme</p>
          <h1 className="admin-title">{product.name}</h1>
          <p className="admin-subtitle">Kritik fiyat değişiklikleri otomatik kaydedilmez; kaydet butonuna basmanız gerekir.</p>
        </div>
      </header>
      <ProductEditor categories={categories} product={product} />
    </>
  );
}
