import type { Context } from "hono";
import { deleteLink } from "../../lib/db";
import { initDb } from "../../lib/init-db";

export default async (c: Context) => {
  initDb();

  if (c.req.method === "DELETE") {
    const id = parseInt(c.req.param("id"), 10);
    deleteLink(id);
    return c.json({ ok: true });
  }

  return c.json({ error: "Method not allowed" }, 405);
};