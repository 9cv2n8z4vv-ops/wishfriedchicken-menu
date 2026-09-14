import { MenuSorter } from "@/components/admin/MenuSorter";
import { getAdminCategories, getAllProducts } from "@/lib/db/menu";

export default async function MenuEditPage() {
  const [categories, products] = await Promise.all([getAdminCategories(), getAllProducts()]);
  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-kicker">Menü Düzenleme</p>
          <h1 className="admin-title">Sıralama</h1>
          <p className="admin-subtitle">Kategorileri ve kategori içindeki ürünleri sürükleyerek sıralayın. Bitirdiğinizde Değişiklikleri Kaydet butonuna basın.</p>
        </div>
      </header>
      <MenuSorter categories={categories} products={products} />
    </>
  );
}
