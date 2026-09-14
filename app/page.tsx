import Image from "next/image";
import type { Metadata } from "next";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { MenuProduct } from "@/components/menu/MenuProduct";
import { getPublicMenu, getSettings } from "@/lib/db/menu";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSettings();
    return {
      title: "Wish Fried Chicken | Menü",
      description: settings.meta_description,
      openGraph: {
        title: "Wish Fried Chicken | Menü",
        description: settings.meta_description,
        type: "website",
        images: [{ url: "/wish-logo.png", width: 758, height: 1030, alt: "Wish Fried Chicken" }]
      }
    };
  } catch {
    return {
      title: "Wish Fried Chicken | Menü",
      description: "Wish Fried Chicken güncel menüsü, burgerlar, wings, tenders, Wish Specials, soslar ve içecekler."
    };
  }
}

export default async function HomePage() {
  try {
    const [categories, settings] = await Promise.all([getPublicMenu(), getSettings()]);

    return (
      <div className="menu-page">
        <header className="menu-hero">
          <Image
            src="/wish-logo.png"
            alt="Wish Fried Chicken"
            width={758}
            height={1030}
            priority
            className="menu-logo"
            sizes="(max-width: 560px) 190px, 228px"
          />
          <h1 className="menu-intro">MENÜ</h1>
        </header>

        <CategoryNav categories={categories.map(({ id, slug, name }) => ({ id, slug, name }))} />

        <main className="menu-content">
          {categories.map((category) => (
            <section className="menu-section" id={category.slug} key={category.id} aria-labelledby={`${category.slug}-title`}>
              <h2 className="category-heading" id={`${category.slug}-title`}>{category.name}</h2>
              {category.description ? <p className="category-description">{category.description}</p> : null}
              <div className="product-list">
                {category.products.map((product) => (
                  <MenuProduct key={product.id} product={product} missingPriceText={settings.missing_price_text} />
                ))}
              </div>
            </section>
          ))}
        </main>

        <footer className="menu-footer">
          <div className="brand">{settings.footer_text}</div>
          
        </footer>
      </div>
    );
  } catch (error) {
    console.error("Public menu failed to load", error);
    return (
      <main className="public-error">
        <div className="public-error-inner">
          <h1>Menü şu anda yüklenemiyor</h1>
          <p>Lütfen kısa bir süre sonra tekrar deneyin.</p>
        </div>
      </main>
    );
  }
}
