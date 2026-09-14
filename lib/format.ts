export function formatPrice(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return null;
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return null;
  return `${new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: Number.isInteger(numeric) ? 0 : 2,
    maximumFractionDigits: 2
  }).format(numeric)} TL`;
}

export function spiceEmoji(level: number) {
  return level > 0 ? "🌶️".repeat(Math.min(3, Math.max(0, level))) : "";
}

export function slugify(input: string) {
  return input
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "kategori";
}

export function productPriceSummary(product: { price: string | number | null; price_options?: { label: string; price: string | number }[] }) {
  if (product.price_options?.length) return product.price_options.map(o => `${o.label} — ${formatPrice(o.price)}`).join(" · ");
  return formatPrice(product.price) ?? "Fiyat belirtilmemiş";
}
