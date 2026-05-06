import { mkdirSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../data");
const DB_PATH = join(DATA_DIR, "globe.db");

function runSqlRaw(sql: string) {
  const result = spawnSync("sqlite3", [DB_PATH, sql], { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`sqlite3 error: ${result.stderr}\nSQL: ${sql}`);
  }
  return result.stdout;
}

function getColumns(table: string): string[] {
  const output = runSqlRaw(`PRAGMA table_info(${table});`);
  return output
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split("|")[1])
    .filter(Boolean);
}

function ensureColumn(table: string, column: string, definition: string) {
  if (getColumns(table).includes(column)) {
    return;
  }
  runSqlRaw(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`);
}

export function getDbPath(): string {
  mkdirSync(DATA_DIR, { recursive: true });
  return DB_PATH;
}

export function initDb(): void {
  const dbPath = getDbPath();
  const schema = readFileSync(join(__dirname, "schema.sql"), "utf8");
  const init = spawnSync("sqlite3", [dbPath], {
    input: schema,
    encoding: "utf8",
  });

  if (init.status !== 0) {
    throw new Error(`initDb failed: ${init.stderr}`);
  }

  ensureColumn("hubs", "url", "TEXT NOT NULL DEFAULT ''");
  ensureColumn("hubs", "tags", "TEXT NOT NULL DEFAULT '[]'");
  ensureColumn("hubs", "creator_handle", "TEXT NOT NULL DEFAULT ''");
  ensureColumn("hubs", "featured", "INTEGER NOT NULL DEFAULT 0");
  ensureColumn(
    "hubs",
    "privacy_offset_applied",
    "INTEGER NOT NULL DEFAULT 1",
  );
  runSqlRaw(
    "CREATE UNIQUE INDEX IF NOT EXISTS links_unique_pair ON links(from_handle, to_handle);",
  );
  console.log("[globe] DB initialized at", dbPath);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  initDb();
}
