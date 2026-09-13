export type Category = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ProductPriceOption = {
  id: string;
  product_id: string;
  label: string;
  price: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: string | null;
  spice_level: number;
  sort_order: number;
  is_active: boolean;
  note: string | null;
  created_at?: string;
  updated_at?: string;
  price_options?: ProductPriceOption[];
};

export type MenuCategory = Category & {
  products: Product[];
};

export type AdminUser = {
  id: string;
  username: string;
};

export type AppSettings = {
  site_name: string;
  footer_text: string;
  missing_price_text: string;
  meta_description: string;
};
