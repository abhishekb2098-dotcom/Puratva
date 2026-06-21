import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

const envFile = readFileSync(".env", "utf-8");
for (const line of envFile.split("\n")) {
  const m = line.match(/^([A-Z_]+)="?([^"]*)"?/);
  if (m) process.env[m[1]] = m[2];
}

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Missing DATABASE_URL or TURSO_AUTH_TOKEN");
  process.exit(1);
}

const client = createClient({ url, authToken });

const patches = [
  {
    name: "Add status column to products",
    sql: `ALTER TABLE products ADD COLUMN "status" TEXT NOT NULL DEFAULT 'active'`,
  },
  {
    name: "Create notifications table",
    sql: `CREATE TABLE IF NOT EXISTS "notifications" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "type" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "data" TEXT,
      "isRead" INTEGER NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
  },
];

for (const patch of patches) {
  try {
    await client.execute(patch.sql);
    console.log(`  ✓ ${patch.name}`);
  } catch (err) {
    if (err.message?.includes("duplicate column") || err.message?.includes("already exists")) {
      console.log(`  ~ skipped (already exists): ${patch.name}`);
    } else {
      console.error(`  ✗ ${patch.name}: ${err.message}`);
    }
  }
}

console.log("\nPatch complete.");
client.close();
