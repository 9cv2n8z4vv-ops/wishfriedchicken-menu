export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return;

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) throw new Error("Host header missing");

  const originHost = new URL(origin).host;
  if (originHost !== host) {
    throw new Error("Invalid request origin");
  }
}

export function parseBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

export function parseNonNegativePrice(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) throw new Error("Fiyat 0 veya daha büyük olmalıdır.");
  return String(number);
}

export function parseSpiceLevel(value: unknown) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number > 3) {
    throw new Error("Acılık seviyesi 0 ile 3 arasında olmalıdır.");
  }
  return number;
}

export function parseSortOrder(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.trunc(number)) : fallback;
}
