import Database from "better-sqlite3";
import { readFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../data");
const DB_PATH = join(DATA_DIR, "globe.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  mkdirSync(DATA_DIR, { recursive: true });
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  return _db;
}

export function initDb(): void {
  const db = getDb();
  const schema = readFileSync(join(__dirname, "schema.sql"), "utf8");
  db.exec(schema);
  console.log("[globe] DB initialized at", DB_PATH);
}

// run directly: bun run lib/init-db.ts
if (import.meta.url === `file://${process.argv[1]}`) {
  initDb();
}
