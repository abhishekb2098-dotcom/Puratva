#!/usr/bin/env node
/**
 * End-to-end deployment script for Puratva
 *
 * Steps:
 *   1. Validate prerequisites & environment
 *   2. Install dependencies
 *   3. Run Turso DB migration (create tables if missing)
 *   4. Generate Prisma client
 *   5. Link Vercel project + push env vars
 *   6. Build Next.js locally (smoke-test)
 *   7. Deploy to Vercel production
 *
 * Usage:
 *   node scripts/deploy.mjs              # full deploy
 *   node scripts/deploy.mjs --skip-build # skip local build
 *   node scripts/deploy.mjs --skip-db    # skip DB migration
 *   node scripts/deploy.mjs --preview    # deploy to preview URL
 */

import { execSync, spawnSync } from "child_process";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";
import { tmpdir } from "os";
// @libsql/client is imported dynamically after npm install to avoid
// ERR_MODULE_NOT_FOUND when node_modules is not yet installed

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ─── CLI flags ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const SKIP_BUILD = args.includes("--skip-build");
const SKIP_DB = args.includes("--skip-db");
const PROD = !args.includes("--preview");

// ─── Helpers ──────────────────────────────────────────────────────────────────
const G = "\x1b[32m", Y = "\x1b[33m", R = "\x1b[31m", C = "\x1b[36m", B = "\x1b[1m", X = "\x1b[0m";
let step = 0;
const section = (t) => { step++; console.log(`\n${B}${C}[${step}] ${t}${X}\n${"─".repeat(50)}`); };
const ok   = (m) => console.log(`${G}  ✓${X} ${m}`);
const warn = (m) => console.log(`${Y}  ⚠ ${X} ${m}`);
const fail = (m) => { console.error(`${R}  ✗ ${m}${X}`); process.exit(1); };

function run(cmd, opts = {}) {
  try {
    execSync(cmd, { cwd: ROOT, stdio: opts.silent ? "pipe" : "inherit" });
  } catch (e) {
    if (opts.allowFail) return false;
    fail(`Command failed: ${cmd}`);
  }
  return true;
}

function capture(cmd) {
  try { return execSync(cmd, { cwd: ROOT, stdio: "pipe" }).toString().trim(); }
  catch { return null; }
}

// Set a single Vercel env var — writes value to temp file, pipes via stdin
function vercelEnvSet(key, value, environment = "production") {
  const tmp = join(tmpdir(), `ve_${key}_${Date.now()}.txt`);
  try {
    writeFileSync(tmp, value + "\n", "utf-8");

    // Remove existing silently (ok if not found)
    spawnSync("vercel", ["env", "rm", key, environment, "--yes"], {
      cwd: ROOT, stdio: "pipe",
    });

    // Attempt 1: spawnSync with input string (works when no special shell chars)
    const r1 = spawnSync("vercel", ["env", "add", key, environment], {
      cwd: ROOT,
      input: value + "\n",
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
      shell: false,
    });
    if (r1.status === 0) return true;

    // Attempt 2: redirect from temp file via cmd.exe (Windows)
    const r2 = spawnSync("cmd", ["/c", `vercel env add ${key} ${environment} < "${tmp}"`], {
      cwd: ROOT, stdio: "pipe", shell: false,
    });
    if (r2.status === 0) return true;

    // Attempt 3: redirect from temp file via bash (Git Bash / WSL)
    const r3 = spawnSync("bash", ["-c", `vercel env add ${key} ${environment} < "${tmp.replace(/\\/g, '/')}"`], {
      cwd: ROOT, stdio: "pipe", shell: false,
    });
    return r3.status === 0;
  } finally {
    try { unlinkSync(tmp); } catch {}
  }
}

// ─── 1. Load .env ─────────────────────────────────────────────────────────────
section("Loading environment variables");

// Try .env then .env.local (Vercel pulls to .env.local)
const envFiles = [".env", ".env.local"];
const envVars = {};

for (const f of envFiles) {
  const p = join(ROOT, f);
  if (!existsSync(p)) continue;
  readFileSync(p, "utf-8").split("\n").forEach((line) => {
    const t = line.trim();
    if (!t || t.startsWith("#")) return;
    const eq = t.indexOf("=");
    if (eq === -1) return;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (k && v && !envVars[k]) envVars[k] = v;
  });
  ok(`Loaded ${f}`);
}

if (!Object.keys(envVars).length) fail("No .env or .env.local file found. Copy .env.example and fill in values.");

// Inject into process.env for child processes
Object.entries(envVars).forEach(([k, v]) => { if (!process.env[k]) process.env[k] = v; });

const REQUIRED = ["DATABASE_URL", "TURSO_AUTH_TOKEN", "NEXTAUTH_SECRET", "NEXTAUTH_URL"];
const missing = REQUIRED.filter((k) => !envVars[k]);
if (missing.length) fail(`Missing required env vars in .env: ${missing.join(", ")}`);
if (!envVars.DATABASE_URL.startsWith("libsql://")) fail(`DATABASE_URL must start with libsql://`);

ok(`${Object.keys(envVars).length} vars loaded | DB: ${envVars.DATABASE_URL}`);

// ─── 2. Prerequisites ─────────────────────────────────────────────────────────
section("Checking prerequisites");

ok(`Node.js  ${capture("node --version")}`);
ok(`npm      ${capture("npm --version")}`);

const vercelVer = capture("vercel --version");
if (!vercelVer) fail("Vercel CLI not found. Run: npm i -g vercel");
ok(`Vercel   ${vercelVer}`);

const gitDirty = capture("git status --porcelain");
if (gitDirty) warn("Uncommitted changes detected — deploying working tree");
else ok(`Git clean | branch: ${capture("git rev-parse --abbrev-ref HEAD")}`);

// ─── 3. Install dependencies ──────────────────────────────────────────────────
section("Installing dependencies");
run("npm install");
ok("node_modules up to date");

// ─── 4. DB migration ─────────────────────────────────────────────────────────
if (SKIP_DB) {
  section("Database migration (SKIPPED via --skip-db)");
} else {
  section("Running Turso database migration");

  const migrationSQL = join(ROOT, "prisma/migrations/0001_init/migration.sql");
  if (!existsSync(migrationSQL)) fail(`Migration file not found: ${migrationSQL}`);

  const { createClient } = await import("@libsql/client");
  const client = createClient({ url: envVars.DATABASE_URL, authToken: envVars.TURSO_AUTH_TOKEN });
  const statements = readFileSync(migrationSQL, "utf-8")
    .split("\n").filter((l) => !l.trimStart().startsWith("--")).join("\n")
    .split(";").map((s) => s.trim()).filter(Boolean);

  console.log(`  ${statements.length} statements to apply...`);
  let created = 0, skipped = 0;

  for (const stmt of statements) {
    try {
      await client.execute(stmt);
      const m = stmt.match(/^CREATE\s+(TABLE|INDEX)[^"]*"([^"]+)"/i);
      if (m) { ok(`Created ${m[1].toLowerCase()} "${m[2]}"`); created++; }
    } catch (err) {
      if (err.message?.includes("already exists")) skipped++;
      else fail(`DB error: ${err.message}\n  ${stmt.slice(0, 100)}`);
    }
  }
  client.close();

  created === 0
    ? ok(`All ${skipped} objects already exist — DB is up to date`)
    : ok(`Migration complete — ${created} created, ${skipped} skipped`);
}

// ─── 5. Prisma generate ───────────────────────────────────────────────────────
section("Generating Prisma client");
run("npx prisma generate");
ok("Prisma client generated");

// ─── 6. Link Vercel + sync env vars ──────────────────────────────────────────
section("Linking Vercel project & syncing env vars");

if (!existsSync(join(ROOT, ".vercel/project.json"))) {
  warn("Project not linked — running vercel link...");
  run("vercel link --yes");
}

// What to push: all non-empty, non-placeholder vars
const SKIP_KEYS = new Set(["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"]);
const PLACEHOLDER_PATTERNS = /^(your-|placeholder|rzp_test_placeholder|example)/i;

// Always force the correct PRISMA_DATABASE_URL on Vercel regardless of .env
const toSync = {
  ...envVars,
  PRISMA_DATABASE_URL: "file:./placeholder.db",
};

for (const [key, value] of Object.entries(toSync)) {
  if (!value || SKIP_KEYS.has(key)) { warn(`Skipping ${key}`); continue; }
  if (PLACEHOLDER_PATTERNS.test(value)) { warn(`Skipping ${key} (placeholder)`); continue; }

  const success = vercelEnvSet(key, value);
  if (success) ok(`Set ${key}`);
  else warn(`Could not set ${key} — set it manually in Vercel dashboard`);
}

// ─── 7. Local build ───────────────────────────────────────────────────────────
if (SKIP_BUILD) {
  section("Local build (SKIPPED via --skip-build)");
} else {
  section("Building application locally (smoke test)");
  run("npm run build");
  ok("Build succeeded");
}

// ─── 8. Deploy ────────────────────────────────────────────────────────────────
section(`Deploying to Vercel (${PROD ? "production" : "preview"})`);

const deployOut = capture(PROD ? "vercel --prod --yes" : "vercel --yes");
if (!deployOut) fail("Deployment failed — no output from Vercel CLI");

const url = (deployOut.match(/https:\/\/[^\s]+/) || [])[0] ?? deployOut;

console.log(`\n${B}${G}╔═══════════════════════════════════════════════╗${X}`);
console.log(`${B}${G}║  ✓  DEPLOYMENT SUCCESSFUL                      ║${X}`);
console.log(`${B}${G}╠═══════════════════════════════════════════════╣${X}`);
console.log(`${B}${G}║  URL: ${url.padEnd(40)}║${X}`);
console.log(`${B}${G}╚═══════════════════════════════════════════════╝${X}\n`);
