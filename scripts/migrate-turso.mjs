import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Missing DATABASE_URL or TURSO_AUTH_TOKEN in environment.");
  process.exit(1);
}

const client = createClient({ url, authToken });

const sql = readFileSync(
  join(__dirname, "../prisma/migrations/0001_init/migration.sql"),
  "utf-8"
);

// Strip comment lines, split on semicolons
const statements = sql
  .split("\n")
  .filter((line) => !line.trimStart().startsWith("--"))
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

console.log(`Applying ${statements.length} SQL statements to Turso...`);

for (const statement of statements) {
  try {
    await client.execute(statement);
    const match = statement.match(/^CREATE\s+(TABLE|INDEX)[^"]*"([^"]+)"/i);
    if (match) console.log(`  ✓ ${match[1]} "${match[2]}"`);
  } catch (err) {
    if (err.message?.includes("already exists")) {
      const match = statement.match(/"([^"]+)"/);
      console.log(`  ~ skipped (already exists): ${match?.[1] ?? statement.slice(0, 40)}`);
    } else {
      console.error(`  ✗ Failed: ${err.message}`);
      console.error(`    Statement: ${statement.slice(0, 120)}`);
      process.exit(1);
    }
  }
}

console.log("\nMigration complete.");
client.close();
