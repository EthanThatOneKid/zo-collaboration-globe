import type { Context } from "hono";
import { getAllHubs, upsertHub } from "../../lib/db";
import { initDb } from "../../lib/init-db";

export default async (c: Context) => {
  initDb();

  if (c.req.method === "GET") {
    return c.json({ hubs: getAllHubs() });
  }

  if (c.req.method === "POST") {
    const body = await c.req.json();
    const hub = upsertHub({
      handle: body.handle,
      name: body.name,
      location: body.location,
      lat: body.lat,
      lng: body.lng,
      color: body.color ?? "#6366f1",
      bio: body.bio ?? "",
      avatar: body.avatar ?? "🌐",
    });
    return c.json({ hub }, 201);
  }

  return c.json({ error: "Method not allowed" }, 405);
};