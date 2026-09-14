export class ValidationError extends Error {}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected = process.env.SITE_URL ? new URL(process.env.SITE_URL).origin : new URL(request.url).origin;
  if (!origin || origin !== expected) throw new ValidationError("Geçersiz istek kaynağı.");
}

export function parseBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

export function parseNonNegativePrice(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if ((typeof value !== "string" && typeof value !== "number") || !/^\d+(\.\d{1,2})?$/.test(String(value).trim())) throw new ValidationError("Geçerli bir fiyat girin (en fazla iki ondalık).");
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 99999999.99) throw new ValidationError("Fiyat 0 veya daha büyük olmalıdır.");
  return String(number);
}

export function parseSpiceLevel(value: unknown) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number > 3) {
    throw new ValidationError("Acılık seviyesi 0 ile 3 arasında olmalıdır.");
  }
  return number;
}

export function parseSortOrder(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.trunc(number)) : fallback;
}
