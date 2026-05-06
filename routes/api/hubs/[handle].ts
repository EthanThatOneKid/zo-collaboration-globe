import type { Context } from "hono";
import { getHubByHandle, upsertHub } from "../../lib/db";
import { initDb } from "../../lib/init-db";

export default async (c: Context) => {
  initDb();
  const handle = c.req.param("handle");

  if (c.req.method === "GET") {
    const hub = getHubByHandle(handle);
    if (!hub) return c.json({ error: "Not found" }, 404);
    return c.json({ hub });
  }

  if (c.req.method === "PUT") {
    const body = await c.req.json();
    const hub = upsertHub({ ...body, handle });
    return c.json({ hub });
  }

  return c.json({ error: "Method not allowed" }, 405);
};