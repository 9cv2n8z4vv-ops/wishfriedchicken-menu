import { existsSync } from "node:fs";
if (existsSync(".env.local")) process.loadEnvFile(".env.local");
import bcrypt from "bcryptjs";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required.");

const adminUsername = process.env.ADMIN_SEED_USERNAME || "wishfc";
const adminPassword = process.env.ADMIN_SEED_PASSWORD;
if (!adminPassword) {
  throw new Error("ADMIN_SEED_PASSWORD is required. Set it only in your environment, never in client-side code.");
}

const sql = postgres(databaseUrl, {
  ssl: process.env.DATABASE_SSL === "false" ? false : "require",
  max: 1,
  prepare: false
});

type SeedProduct = {
  name: string;
  description?: string;
  price?: number | null;
  spice?: number;
  note?: string;
  options?: { label: string; price: number }[];
};

type SeedCategory = {
  name: string;
  description?: string;
  slug: string;
  products: SeedProduct[];
};

const categories: SeedCategory[] = [
  {
    name: "BURGERS",
    slug: "burgers",
    description: "PATATES KIZARTMASI VE SOS TABAĞI İLE SERVİS EDİLMEKTEDİR",
    products: [
      { name: "CLASSIC BURGER", description: "Wish big sos, iceberg, cheddar peyniri, karamelize soğan", price: 385 },
      { name: "WISH SPECIAL", description: "Wish patlıcan sos, iceberg, barbekü glaze, karamelize soğan", price: 395 },
      { name: "HONEY SLAW", description: "Ballı hardal, cheddar peyniri, mor lahana slaw", price: 395 },
      { name: "TRUFFLE CHEEZY", description: "Trüflü mayonez, Alman turşusu, mix cheese, sote mantar", price: 395 },
      { name: "WISH HEAT", description: "Wish acı tatlı sos, iceberg, Nashville glaze tavuk, cheddar peyniri, jalapeno biber", price: 395, spice: 1 },
      { name: "WISH KOREAN", description: "Sarımsaklı mayonez, coleslaw, Kore glaze tavuk, susam, Alman turşusu", price: 395, spice: 1 },
      { name: "SMOKY", description: "Barbekü relish, iceberg, füme kaburga, çıtır soğan", price: 395 },
      { name: "FUEGO", description: "Chipotle sos, iceberg, buffalo sos, soğan turşusu", price: 395, spice: 2 },
      { name: "WISH ANATOLIAN", description: "Wish patlıcan sos, köz biber / patlıcan mix, cheddar peyniri, chipotle sos", price: 395 }
    ]
  },
  {
    name: "EKSTRA SOSLAR",
    slug: "ekstra-soslar",
    products: [
      { name: "BALLI HARDAL SOS", price: 17 },
      { name: "BARBEKÜ SOS", price: 17 },
      { name: "SARIMSAKLI MAYONEZ", price: 17 },
      { name: "ACI TATLI MAYONEZ", price: 17 },
      { name: "RANCH SOS", price: 17 },
      { name: "TRÜFLÜ MAYONEZ", price: 17 },
      { name: "ACI SOS", price: 17 },
      { name: "CHIPOTLE SOS", price: 17 },
      { name: "SOS TABAĞI", description: "Seçeceğiniz 6 adet sosla servis edilir.", price: 80 }
    ]
  },
  {
    name: "WINGS",
    slug: "wings",
    description: "PATATES KIZARTMASI İLE SERVİS EDİLİR",
    products: [
      { name: "BASIC WINGS", description: "Sade çıtır kanat", options: [{ label: "5'Lİ", price: 370 }, { label: "9'LU", price: 595 }] },
      { name: "BUFFALO WINGS", description: "Buffalo soslu çıtır kanat", spice: 2, options: [{ label: "5'Lİ", price: 385 }, { label: "9'LU", price: 615 }] },
      { name: "BBQ WINGS", description: "BBQ soslu çıtır kanat", options: [{ label: "5'Lİ", price: 385 }, { label: "9'LU", price: 615 }] },
      { name: "KOREAN WINGS", description: "Kore sosu çıtır kanat, susam", spice: 1, options: [{ label: "5'Lİ", price: 385 }, { label: "9'LU", price: 615 }] }
    ]
  },
  {
    name: "TENDERS",
    slug: "tenders",
    description: "PATATES KIZARTMASI İLE SERVİS EDİLİR",
    products: [
      { name: "5'Lİ TENDERS", price: 375 },
      { name: "7'Lİ TENDERS", price: 475 },
      { name: "9'LU TENDERS", price: 550 }
    ]
  },
  {
    name: "WISH SPECIALS",
    slug: "wish-specials",
    description: "PATATES KIZARTMASI İLE SERVİS EDİLİR",
    products: [
      { name: "DYNAMITE CHICKEN", description: "Çıtır tavuk parçaları, acı tatlı sos, susam", price: 380, spice: 2 },
      { name: "BBQ CHICKEN", description: "BBQ relish sos, çıtır tavuk parçaları", price: 380 },
      { name: "WISH KOREAN CHICKEN", description: "Wish Kore sosu, çıtır tavuk parçaları, susam", price: null, spice: 1, note: "Kaynak menüde fiyat belirtilmemiştir." }
    ]
  },
  {
    name: "İÇECEKLER",
    slug: "icecekler",
    products: [
      { name: "KOLA", price: 80 },
      { name: "SPRITE", price: 80 },
      { name: "FANTA", price: 80 },
      { name: "FUSE TEA", price: 80 },
      { name: "AYRAN", price: 80 },
      { name: "SU", price: 40 },
      { name: "SODA", price: 40 }
    ]
  }
];

try {
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await sql`
    insert into admin_users (username, password_hash)
    values (${adminUsername}, ${passwordHash})
    on conflict (username) do nothing
  `;

  const [{ count }] = await sql<{ count: number }[]>`select count(*)::int as count from categories`;
  if (count === 0) {
    await sql.begin(async (tx) => {
      for (const [categoryIndex, category] of categories.entries()) {
        const [createdCategory] = await tx<{ id: string }[]>`
          insert into categories (name, description, slug, sort_order, is_active)
          values (${category.name}, ${category.description ?? null}, ${category.slug}, ${categoryIndex + 1}, true)
          returning id
        `;

        for (const [productIndex, product] of category.products.entries()) {
          const [createdProduct] = await tx<{ id: string }[]>`
            insert into products (category_id, name, description, price, spice_level, sort_order, is_active, note)
            values (
              ${createdCategory.id},
              ${product.name},
              ${product.description ?? null},
              ${product.price ?? null},
              ${product.spice ?? 0},
              ${productIndex + 1},
              true,
              ${product.note ?? null}
            )
            returning id
          `;

          for (const [optionIndex, option] of (product.options ?? []).entries()) {
            await tx`
              insert into product_price_options (product_id, label, price, sort_order)
              values (${createdProduct.id}, ${option.label}, ${option.price}, ${optionIndex + 1})
            `;
          }
        }
      }
    });
    console.log("Menu seed completed.");
  } else {
    console.log("Menu seed skipped because categories already exist.");
  }

  const settings = {
    site_name: "WISH FRIED CHICKEN",
    footer_text: "WISH FRIED CHICKEN",
    missing_price_text: "Fiyat bilgisi yakında",
    meta_description: "Wish Fried Chicken güncel menüsü, burgerlar, wings, tenders, Wish Specials, soslar ve içecekler."
  };

  for (const [key, value] of Object.entries(settings)) {
    await sql`
      insert into app_settings (key, value)
      values (${key}, ${value})
      on conflict (key) do nothing
    `;
  }

  console.log(`Admin user '${adminUsername}' is ready.`);
} finally {
  await sql.end();
}
