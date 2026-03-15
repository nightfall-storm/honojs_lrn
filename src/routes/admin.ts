import { Hono } from "hono";

export const adminRoutes = new Hono();

adminRoutes.get("/", (c) => {
  return c.json({ message: "Admin API" });
});
