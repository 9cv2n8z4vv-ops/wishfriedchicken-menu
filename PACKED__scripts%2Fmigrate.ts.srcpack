import fs from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required.");

const sql = postgres(databaseUrl, {
  ssl: process.env.DATABASE_SSL === "false" ? false : "require",
  max: 1,
  prepare: false
});

try {
  const migration = await fs.readFile(path.join(process.cwd(), "database", "001_init.sql"), "utf8");
  await sql.unsafe(migration);
  console.log("Database migration completed.");
} finally {
  await sql.end();
}
