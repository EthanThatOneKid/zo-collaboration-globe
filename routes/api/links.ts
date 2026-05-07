import type { Context } from "hono";
import { getAllLinks, addLink } from "../../lib/db";
import { initDb } from "../../lib/init-db";
import { normalizeLinkType } from "../../lib/data";

export default async (c: Context) => {
  initDb();

  if (c.req.method === "GET") {
    const links = getAllLinks();
    return c.json({ links });
  }

  if (c.req.method === "POST") {
    let body: Record<string, unknown>;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON" }, 400);
    }

    const fromHandle = typeof body.from_handle === "string" ? body.from_handle.trim() : "";
    const toHandle = typeof body.to_handle === "string" ? body.to_handle.trim() : "";
    const rawLinkType = normalizeLinkType(body.link_type);

    if (!fromHandle || !toHandle) {
      return c.json({ error: "from_handle and to_handle are required" }, 400);
    }

    if (fromHandle === toHandle) {
      return c.json({ error: "Cannot link a space to itself" }, 400);
    }

    const link = addLink(fromHandle, toHandle, rawLinkType);
    return c.json({ link }, 201);
  }

  return c.json({ error: "Method not allowed" }, 405);
};
