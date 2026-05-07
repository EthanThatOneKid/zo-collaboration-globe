import { spawnSync } from "node:child_process";
import {
  normalizeSpaceRecord,
  parseTags,
  SAMPLE_LINKS,
  SAMPLE_SPACES,
  serializeTags,
  type LinkRecord,
  type SpaceRecord,
} from "./data";
import { getDbPath } from "./init-db";

type SpaceInput = {
  handle: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  color?: string;
  bio?: string;
  avatar?: string;
  url: string;
  tags?: string[];
  creator_handle: string;
  featured?: boolean;
  privacy_offset_applied?: boolean;
};

export type LinkType = "friend" | "collab" | "alum" | "mentor" | "sponsor";

function escapeSql(value: string): string {
  return value.replaceAll("'", "''");
}

function sqlValue(value: string | number | boolean): string {
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "0";
  }
  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }
  return `'${escapeSql(value)}'`;
}

function runSql(sql: string): Record<string, unknown>[] {
  const result = spawnSync("sqlite3", [getDbPath(), "-json", sql], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(`sqlite3 error: ${result.stderr}\nSQL: ${sql}`);
  }

  if (!result.stdout.trim()) {
    return [];
  }

  return JSON.parse(result.stdout) as Record<string, unknown>[];
}

function execSql(sql: string): void {
  const result = spawnSync("sqlite3", [getDbPath(), sql], { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`sqlite3 error: ${result.stderr}\nSQL: ${sql}`);
  }
}

function mapSpaceRows(rows: Record<string, unknown>[]): SpaceRecord[] {
  return rows
    .map(normalizeSpaceRecord)
    .filter((space): space is SpaceRecord => Boolean(space));
}

function rowToLink(row: Record<string, unknown>): LinkRecord {
  return {
    id: Number(row.id ?? 0),
    from_handle: String(row.from_handle ?? ""),
    to_handle: String(row.to_handle ?? ""),
    link_type: String(row.link_type ?? "friend"),
  };
}

function getLegacyHandleSet() {
  return new Set(["etok", "vangogh", "picasso", "kahlo", "okeeffe", "kusama"]);
}

export function getAllSpaces(): SpaceRecord[] {
  const rows = runSql("SELECT * FROM hubs ORDER BY featured DESC, id ASC;");
  return mapSpaceRows(rows);
}

export function getSpaceByHandle(handle: string): SpaceRecord | null {
  const rows = runSql(
    `SELECT * FROM hubs WHERE handle = ${sqlValue(handle)} LIMIT 1;`,
  );
  return rows[0] ? normalizeSpaceRecord(rows[0]) : null;
}

export function upsertSpace(space: SpaceInput): SpaceRecord {
  execSql(`
    INSERT INTO hubs
      (handle, name, location, lat, lng, color, bio, avatar, url, tags, creator_handle, featured, privacy_offset_applied)
    VALUES
      (${sqlValue(space.handle)}, ${sqlValue(space.name)}, ${sqlValue(space.location)}, ${sqlValue(space.lat)}, ${sqlValue(space.lng)}, ${sqlValue(space.color ?? "#3b82f6")}, ${sqlValue(space.bio ?? "")}, ${sqlValue(space.avatar ?? "🌐")}, ${sqlValue(space.url)}, ${sqlValue(serializeTags(space.tags ?? []))}, ${sqlValue(space.creator_handle)}, ${sqlValue(Boolean(space.featured))}, ${sqlValue(space.privacy_offset_applied !== false)})
    ON CONFLICT(handle) DO UPDATE SET
      name=excluded.name,
      location=excluded.location,
      lat=excluded.lat,
      lng=excluded.lng,
      color=excluded.color,
      bio=excluded.bio,
      avatar=excluded.avatar,
      url=excluded.url,
      tags=excluded.tags,
      creator_handle=excluded.creator_handle,
      featured=excluded.featured,
      privacy_offset_applied=excluded.privacy_offset_applied;
  `);

  return getSpaceByHandle(space.handle)!;
}

export function getAllLinks(): LinkRecord[] {
  return runSql("SELECT * FROM links ORDER BY id ASC;").map(rowToLink);
}

export function addLink(
  fromHandle: string,
  toHandle: string,
  linkType: LinkType = "friend",
): LinkRecord {
  const validLinkTypes: LinkType[] = ["friend", "collab", "alum", "mentor", "sponsor"];
  const normalized = validLinkTypes.includes(linkType) ? linkType : "friend";

  execSql(`
    INSERT OR IGNORE INTO links (from_handle, to_handle, link_type)
    VALUES (${sqlValue(fromHandle)}, ${sqlValue(toHandle)}, ${sqlValue(normalized)});
  `);

  const rows = runSql(`
    SELECT * FROM links
    WHERE from_handle = ${sqlValue(fromHandle)}
      AND to_handle = ${sqlValue(toHandle)}
    LIMIT 1;
  `);

  return rowToLink(rows[0]);
}

export function deleteLink(id: number): void {
  execSql(`DELETE FROM links WHERE id = ${sqlValue(id)};`);
}

export function seedRegistryIfNeeded() {
  const existingHandles = new Set(
    runSql("SELECT handle FROM hubs;").map((row) => String(row.handle)),
  );
  const legacyHandles = getLegacyHandleSet();
  const hasOnlyLegacyRows =
    existingHandles.size > 0 &&
    [...existingHandles].every((handle) => legacyHandles.has(handle));

  if (hasOnlyLegacyRows) {
    execSql("DELETE FROM links;");
    execSql("DELETE FROM hubs;");
  }

  for (const space of SAMPLE_SPACES) {
    upsertSpace(space);
  }

  for (const link of SAMPLE_LINKS) {
    addLink(link.from_handle, link.to_handle, link.link_type);
  }
}

export function sanitizeTags(value: unknown): string[] {
  return parseTags(value).slice(0, 6);
}
