import { CategoryManager } from "@/components/admin/CategoryManager";
import { getAdminCategories } from "@/lib/db/menu";

export default async function CategoriesPage() {
  const categories = await getAdminCategories();
  return (
    <>
      <header className="admin-page-head">
        <div>
          <p className="admin-kicker">İçerik</p>
          <h1 className="admin-title">Kategoriler</h1>
          <p className="admin-subtitle">Kategori oluşturun, düzenleyin, görünürlüğünü değiştirin veya güvenli onayla silin.</p>
        </div>
      </header>
      <CategoryManager categories={categories} />
    </>
  );
}
