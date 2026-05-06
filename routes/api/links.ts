import type { Context } from "hono";
import { getAllLinks, addLink } from "../../lib/db";
import { initDb } from "../../lib/init-db";

export default async (c: Context) => {
  initDb();

  if (c.req.method === "GET") {
    return c.json({ links: getAllLinks() });
  }

  if (c.req.method === "POST") {
    const body = await c.req.json();
    const link = addLink(body.from_handle, body.to_handle);
    return c.json({ link }, 201);
  }

  return c.json({ error: "Method not allowed" }, 405);
};