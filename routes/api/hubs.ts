import type { Context } from "hono";
import { getAllSpaces, sanitizeTags, seedRegistryIfNeeded, upsertSpace } from "../../lib/db";
import { initDb } from "../../lib/init-db";

export default async (c: Context) => {
  initDb();
  seedRegistryIfNeeded();

  if (c.req.method === "GET") {
    const spaces = getAllSpaces();
    return c.json({ spaces, hubs: spaces });
  }

  if (c.req.method === "POST") {
    const body = await c.req.json();
    const handle = String(body.handle ?? "").trim().toLowerCase();
    const url = String(body.url ?? "").trim();
    const creatorHandle = String(body.creator_handle ?? "").trim().toLowerCase();

    if (!handle || !url || !creatorHandle) {
      return c.json(
        { error: "handle, url, and creator_handle are required" },
        400,
      );
    }

    const space = upsertSpace({
      handle,
      name: String(body.name ?? handle),
      location: String(body.location ?? ""),
      lat: Number(body.lat),
      lng: Number(body.lng),
      color: body.color ?? "#3b82f6",
      bio: body.bio ?? "",
      avatar: body.avatar ?? "🌐",
      url,
      tags: sanitizeTags(body.tags),
      creator_handle: creatorHandle,
      featured: Boolean(body.featured),
      privacy_offset_applied: body.privacy_offset_applied !== false,
    });
    return c.json({ space, hub: space }, 201);
  }

  return c.json({ error: "Method not allowed" }, 405);
};
