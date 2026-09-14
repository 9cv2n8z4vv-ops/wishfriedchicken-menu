import "server-only";
import { sql } from "@/lib/db";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import type { AppSettings, Category, MenuCategory, Product, ProductPriceOption } from "@/types/menu";

export async function getPublicMenu(): Promise<MenuCategory[]> {
  const [categoryRows, productRows, optionRows] = await Promise.all([
    sql<Category[]>`
      select id, name, description, slug, sort_order, is_active, created_at, updated_at
      from categories
      where is_active = true
      order by sort_order asc, created_at asc
    `,
    sql<Product[]>`
      select id, category_id, name, description, price, spice_level, sort_order, is_active, note, created_at, updated_at
      from products
      where is_active = true
      order by sort_order asc, created_at asc
    `,
    sql<ProductPriceOption[]>`
      select id, product_id, label, price, sort_order, created_at, updated_at
      from product_price_options
      order by sort_order asc, created_at asc
    `
  ]);

  const optionsByProduct = new Map<string, ProductPriceOption[]>();
  for (const option of optionRows) {
    const current = optionsByProduct.get(option.product_id) ?? [];
    current.push(option);
    optionsByProduct.set(option.product_id, current);
  }

  const productsByCategory = new Map<string, Product[]>();
  for (const product of productRows) {
    const current = productsByCategory.get(product.category_id) ?? [];
    current.push({ ...product, price_options: optionsByProduct.get(product.id) ?? [] });
    productsByCategory.set(product.category_id, current);
  }

  return categoryRows
    .map((category) => ({
      ...category,
      products: productsByCategory.get(category.id) ?? []
    }))
    .filter((category) => category.products.length > 0);
}

export async function getAdminCategories(): Promise<(Category & { product_count: number })[]> {
  return sql<(Category & { product_count: number })[]>`
    select
      c.id, c.name, c.description, c.slug, c.sort_order, c.is_active, c.created_at, c.updated_at,
      count(p.id)::int as product_count
    from categories c
    left join products p on p.category_id = c.id
    group by c.id
    order by c.sort_order asc, c.created_at asc
  `;
}

export async function getCategoryById(id: string) {
  const [category] = await sql<Category[]>`
    select id, name, description, slug, sort_order, is_active, created_at, updated_at
    from categories where id = ${id} limit 1
  `;
  if (!category) return null;

  const products = await sql<Product[]>`
    select id, category_id, name, description, price, spice_level, sort_order, is_active, note, created_at, updated_at,
      coalesce((select json_agg(json_build_object('id',o.id,'label',o.label,'price',o.price::text) order by o.sort_order) from product_price_options o where o.product_id = products.id), '[]'::json) as price_options
    from products
    where category_id = ${id}
    order by sort_order asc, created_at asc
  `;

  return { ...category, products };
}

export async function getAllProducts(query = "") {
  const like = `%${query.trim()}%`;
  return sql<(Product & { category_name: string })[]>`
    select
      p.id, p.category_id, p.name, p.description, p.price, p.spice_level, p.sort_order,
      p.is_active, p.note, p.created_at, p.updated_at,
      c.name as category_name,
      coalesce((select json_agg(json_build_object('id',o.id,'label',o.label,'price',o.price::text) order by o.sort_order) from product_price_options o where o.product_id = p.id), '[]'::json) as price_options
    from products p
    join categories c on c.id = p.category_id
    where (${query.trim()} = '' or p.name ilike ${like} or coalesce(p.description, '') ilike ${like})
    order by c.sort_order asc, p.sort_order asc, p.created_at asc
  `;
}

export async function getProductById(id: string) {
  const [product] = await sql<Product[]>`
    select id, category_id, name, description, price, spice_level, sort_order, is_active, note, created_at, updated_at
    from products where id = ${id} limit 1
  `;
  if (!product) return null;

  const options = await sql<ProductPriceOption[]>`
    select id, product_id, label, price, sort_order, created_at, updated_at
    from product_price_options
    where product_id = ${id}
    order by sort_order asc, created_at asc
  `;

  return { ...product, price_options: options };
}

export async function getSettings(): Promise<AppSettings> {
  const rows = await sql<{ key: string; value: string }[]>`
    select key, value from app_settings
    where key in ('site_name', 'footer_text', 'missing_price_text', 'meta_description')
  `;
  const map = new Map(rows.map((row) => [row.key, row.value]));
  return {
    site_name: map.get("site_name") ?? DEFAULT_SETTINGS.site_name,
    footer_text: map.get("footer_text") ?? DEFAULT_SETTINGS.footer_text,
    missing_price_text: map.get("missing_price_text") ?? DEFAULT_SETTINGS.missing_price_text,
    meta_description: map.get("meta_description") ?? DEFAULT_SETTINGS.meta_description
  };
}

export async function getDashboardStats() {
  const [row] = await sql<{
    categories: number;
    active_categories: number;
    products: number;
    active_products: number;
    missing_prices: number;
  }[]>`
    select
      (select count(*)::int from categories) as categories,
      (select count(*)::int from categories where is_active = true) as active_categories,
      (select count(*)::int from products) as products,
      (select count(*)::int from products where is_active = true) as active_products,
      (select count(*)::int from products p
        where p.price is null
        and not exists (select 1 from product_price_options o where o.product_id = p.id)
      ) as missing_prices
  `;
  return row;
}
