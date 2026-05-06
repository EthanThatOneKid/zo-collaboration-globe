import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../data");
const DB_PATH = join(DATA_DIR, "globe.db");

let _dbPath: string | null = null;

export function getDbPath(): string {
  if (_dbPath) return _dbPath;
  mkdirSync(DATA_DIR, { recursive: true });
  _dbPath = DB_PATH;
  return _dbPath;
}

function runSql(sql: string, args: string[] = []): Record<string, unknown>[] {
  const db = getDbPath();
  const allArgs = [db, "-json", sql, ...args];
  const result = spawnSync("sqlite3", allArgs, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`sqlite3 error: ${result.stderr}\nSQL: ${sql}`);
  }
  if (!result.stdout.trim()) return [];
  return JSON.parse(result.stdout);
}

export function initDb(): void {
  const schemaPath = join(__dirname, "schema.sql");
  const db = getDbPath();
  const r = spawnSync("sqlite3", [db, `.read "${schemaPath}"`], {
    encoding: "utf8",
  });
  if (r.status !== 0) throw new Error(`initDb failed: ${r.stderr}`);
  console.log("[globe] DB initialized at", db);
}

// Hub queries
export function getAllHubs(): Record<string, unknown>[] {
  return runSql("SELECT * FROM hubs ORDER BY id");
}

export function getHubByHandle(handle: string): Record<string, unknown> | null {
  const rows = runSql("SELECT * FROM hubs WHERE handle = ?", [handle]);
  return (rows as Record<string, unknown>[])[0] ?? null;
}

export function upsertHub(hub: {
  handle: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  color: string;
  bio: string;
  avatar: string;
}): Record<string, unknown> {
  const existing = getHubByHandle(hub.handle);
  if (existing) {
    runSql(
      `UPDATE hubs SET name=?,location=?,lat=?,lng=?,color=?,bio=?,avatar=? WHERE handle=?`,
      [hub.name, hub.location, hub.lat, hub.lng, hub.color, hub.bio, hub.avatar, hub.handle]
    );
  } else {
    runSql(
      `INSERT INTO hubs (handle,name,location,lat,lng,color,bio,avatar) VALUES (?,?,?,?,?,?,?,?)`,
      [hub.handle, hub.name, hub.location, hub.lat, hub.lng, hub.color, hub.bio, hub.avatar]
    );
  }
  return getHubByHandle(hub.handle)!;
}

// Link queries
export function getAllLinks(): Record<string, unknown>[] {
  return runSql("SELECT * FROM links ORDER BY id");
}

export function addLink(from_handle: string, to_handle: string): Record<string, unknown> {
  runSql("INSERT OR IGNORE INTO links (from_handle,to_handle) VALUES (?,?)", [
    from_handle,
    to_handle,
  ]);
  const rows = runSql(
    "SELECT * FROM links WHERE from_handle=? AND to_handle=?",
    [from_handle, to_handle]
  );
  return (rows as Record<string, unknown>[])[0];
}

export function deleteLink(id: number): void {
  runSql("DELETE FROM links WHERE id = ?", [String(id)]);
}

// run directly: bun run lib/db.ts
if (import.meta.url === `file://${process.argv[1]}`) {
  initDb();
  console.log(getAllHubs());
}
