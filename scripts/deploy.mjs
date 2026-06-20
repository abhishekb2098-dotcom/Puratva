#!/usr/bin/env node
/**
 * End-to-end deployment script for Puratva
 *
 * Steps:
 *   1. Validate prerequisites & environment
 *   2. Run Turso DB migration (create tables if missing)
 *   3. Generate Prisma client
 *   4. Push env vars to Vercel
 *   5. Build Next.js locally (smoke-test)
 *   6. Deploy to Vercel production
 *
 * Usage:
 *   node scripts/deploy.mjs              # reads .env automatically
 *   node scripts/deploy.mjs --skip-build # skip local build (faster)
 *   node scripts/deploy.mjs --skip-db    # skip DB migration
 */

import { execSync, spawnSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { createClient } from "@libsql/client";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ─── CLI flags ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const SKIP_BUILD = args.includes("--skip-build");
const SKIP_DB = args.includes("--skip-db");
const PROD = !args.includes("--preview"); // default: production deploy

// ─── Helpers ──────────────────────────────────────────────────────────────────
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

let step = 0;
function section(title) {
  step++;
  console.log(`\n${BOLD}${CYAN}[${ step }] ${title}${RESET}`);
  console.log("─".repeat(50));
}
const ok = (msg) => console.log(`${GREEN}  ✓${RESET} ${msg}`);
const warn = (msg) => console.log(`${YELLOW}  ⚠${RESET}  ${msg}`);
const fail = (msg) => { console.error(`${RED}  ✗ ${msg}${RESET}`); process.exit(1); };

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { cwd: ROOT, stdio: opts.silent ? "pipe" : "inherit", ...opts });
  } catch (e) {
    if (opts.allowFail) return null;
    fail(`Command failed: ${cmd}\n${e.message}`);
  }
}

function runCapture(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, stdio: "pipe" }).toString().trim();
  } catch {
    return null;
  }
}

// ─── 1. Load .env ─────────────────────────────────────────────────────────────
section("Loading environment variables");

const envPath = join(ROOT, ".env");
if (!existsSync(envPath)) fail(".env file not found. Copy .env.example and fill in values.");

const envVars = {};
readFileSync(envPath, "utf-8")
  .split("\n")
  .forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eq = trimmed.indexOf("=");
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    envVars[key] = val;
    if (!process.env[key]) process.env[key] = val;
  });

// Required env vars
const REQUIRED = [
  "DATABASE_URL",
  "TURSO_AUTH_TOKEN",
  "PRISMA_DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
];
const missing = REQUIRED.filter((k) => !envVars[k]);
if (missing.length) fail(`Missing required env vars: ${missing.join(", ")}`);

// Validate Turso URL
if (!envVars.DATABASE_URL.startsWith("libsql://")) {
  fail(`DATABASE_URL must start with libsql://. Got: ${envVars.DATABASE_URL}`);
}

ok(`Loaded ${Object.keys(envVars).length} env vars from .env`);
ok(`Database: ${envVars.DATABASE_URL}`);

// ─── 2. Prerequisites check ───────────────────────────────────────────────────
section("Checking prerequisites");

const nodeVer = runCapture("node --version");
if (!nodeVer) fail("Node.js not found");
ok(`Node.js ${nodeVer}`);

const npmVer = runCapture("npm --version");
ok(`npm ${npmVer}`);

const vercelVer = runCapture("npx vercel --version");
if (!vercelVer) fail("Vercel CLI not found. Run: npm i -g vercel");
ok(`Vercel CLI ${vercelVer}`);

// Check git is clean enough to deploy
const gitStatus = runCapture("git status --porcelain");
if (gitStatus) warn(`Uncommitted changes detected — deploying current working tree`);
else ok("Git working tree is clean");

const branch = runCapture("git rev-parse --abbrev-ref HEAD");
ok(`Branch: ${branch}`);

// ─── 3. DB migration ─────────────────────────────────────────────────────────
if (SKIP_DB) {
  section("Database migration (SKIPPED)");
  warn("--skip-db flag set, skipping Turso migration");
} else {
  section("Running Turso database migration");

  const migrationSQL = join(ROOT, "prisma/migrations/0001_init/migration.sql");
  if (!existsSync(migrationSQL)) fail(`Migration file not found: ${migrationSQL}`);

  const client = createClient({
    url: envVars.DATABASE_URL,
    authToken: envVars.TURSO_AUTH_TOKEN,
  });

  const sql = readFileSync(migrationSQL, "utf-8");
  const statements = sql
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("--"))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`  Applying ${statements.length} statements...`);
  let created = 0, skipped = 0;

  for (const stmt of statements) {
    try {
      await client.execute(stmt);
      const m = stmt.match(/^CREATE\s+(TABLE|INDEX)[^"]*"([^"]+)"/i);
      if (m) { ok(`Created ${m[1].toLowerCase()} "${m[2]}"`); created++; }
    } catch (err) {
      if (err.message?.includes("already exists")) { skipped++; }
      else fail(`DB error: ${err.message}\nStatement: ${stmt.slice(0, 100)}`);
    }
  }

  client.close();
  if (created === 0 && skipped > 0) ok(`All tables already exist (${skipped} skipped)`);
  else ok(`Migration done — ${created} created, ${skipped} skipped`);
}

// ─── 4. Generate Prisma client ────────────────────────────────────────────────
section("Generating Prisma client");
run("npx prisma generate");
ok("Prisma client generated");

// ─── 5. Set Vercel environment variables ─────────────────────────────────────
section("Syncing environment variables to Vercel");

// Env vars to push to Vercel (all from .env except local-only ones)
const LOCAL_ONLY = new Set(["PRISMA_DATABASE_URL"]);

// Override NEXTAUTH_URL and NEXT_PUBLIC_APP_URL for production
const vercelEnv = {
  ...envVars,
  PRISMA_DATABASE_URL: "file:./placeholder.db", // always this value on Vercel
};

// Detect Vercel project name from .vercel/project.json if linked
const vercelProjectPath = join(ROOT, ".vercel/project.json");
let projectLinked = existsSync(vercelProjectPath);
if (!projectLinked) {
  warn("Project not linked to Vercel yet. Running 'vercel link'...");
  run("npx vercel link --yes");
  projectLinked = existsSync(vercelProjectPath);
}

// Get existing Vercel env var keys
const existingEnvRaw = runCapture("npx vercel env ls --yes 2>/dev/null");

for (const [key, value] of Object.entries(vercelEnv)) {
  if (!value || value.includes("placeholder") && key !== "PRISMA_DATABASE_URL") {
    warn(`Skipping ${key} (placeholder value)`);
    continue;
  }
  if (LOCAL_ONLY.has(key) && key !== "PRISMA_DATABASE_URL") continue;

  // Use spawnSync to safely pass value without shell injection
  const result = spawnSync(
    "npx",
    ["vercel", "env", "add", key, "production", "--yes"],
    {
      cwd: ROOT,
      input: value + "\n",
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }
  );

  if (result.status === 0) {
    ok(`Set ${key}`);
  } else {
    // Try rm + add if already exists
    spawnSync("npx", ["vercel", "env", "rm", key, "production", "--yes"], {
      cwd: ROOT,
      stdio: "pipe",
    });
    const retry = spawnSync(
      "npx",
      ["vercel", "env", "add", key, "production", "--yes"],
      {
        cwd: ROOT,
        input: value + "\n",
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      }
    );
    if (retry.status === 0) ok(`Updated ${key}`);
    else warn(`Could not set ${key}: ${retry.stderr?.trim()}`);
  }
}

// ─── 6. Local build (smoke test) ─────────────────────────────────────────────
if (SKIP_BUILD) {
  section("Local build (SKIPPED)");
  warn("--skip-build flag set, skipping local build verification");
} else {
  section("Building application locally (smoke test)");
  run("npm run build");
  ok("Build succeeded");
}

// ─── 7. Deploy to Vercel ─────────────────────────────────────────────────────
section(`Deploying to Vercel (${PROD ? "production" : "preview"})`);

const deployCmd = PROD ? "npx vercel --prod --yes" : "npx vercel --yes";
const deployOutput = runCapture(deployCmd);

if (!deployOutput) fail("Deployment failed — no output from Vercel CLI");

const urlMatch = deployOutput.match(/https:\/\/[^\s]+/);
const deployUrl = urlMatch ? urlMatch[0] : deployOutput;

console.log(`\n${BOLD}${GREEN}╔══════════════════════════════════════════╗${RESET}`);
console.log(`${BOLD}${GREEN}║   DEPLOYMENT SUCCESSFUL                  ║${RESET}`);
console.log(`${BOLD}${GREEN}╠══════════════════════════════════════════╣${RESET}`);
console.log(`${BOLD}${GREEN}║  URL: ${deployUrl.padEnd(35)}║${RESET}`);
console.log(`${BOLD}${GREEN}╚══════════════════════════════════════════╝${RESET}\n`);
