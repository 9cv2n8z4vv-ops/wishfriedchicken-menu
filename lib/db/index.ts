import "server-only";
import postgres from "postgres";

function createClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required.");
  }

  return postgres(databaseUrl, {
    ssl: process.env.DATABASE_SSL === "false" ? false : "require",
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false
  });
}

type SqlClient = ReturnType<typeof createClient>;
const globalForDb = globalThis as unknown as { wishSql?: SqlClient };

// Delay connection setup until a request/query, so builds need no database secret.
export const sql = new Proxy(function () {}, {
  apply(_target, _this, args) {
    const client = globalForDb.wishSql ??= createClient();
    return Reflect.apply(client, client, args);
  },
  get(_target, property) {
    const client = globalForDb.wishSql ??= createClient();
    const value = Reflect.get(client, property);
    return typeof value === "function" ? value.bind(client) : value;
  }
}) as unknown as SqlClient;
