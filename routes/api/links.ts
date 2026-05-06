import type { Context } from "hono";
import { addLink, getAllLinks, seedRegistryIfNeeded } from "../../lib/db";
import { initDb } from "../../lib/init-db";

export default async (c: Context) => {
  initDb();
  seedRegistryIfNeeded();

  if (c.req.method === "GET") {
    return c.json({ links: getAllLinks() });
  }

  if (c.req.method === "POST") {
    const body = await c.req.json();
    const fromHandle = String(body.from_handle ?? "").trim().toLowerCase();
    const toHandle = String(body.to_handle ?? "").trim().toLowerCase();

    if (!fromHandle || !toHandle || fromHandle === toHandle) {
      return c.json({ error: "valid from_handle and to_handle are required" }, 400);
    }

    const link = addLink(fromHandle, toHandle);
    return c.json({ link }, 201);
  }

  return c.json({ error: "Method not allowed" }, 405);
};
