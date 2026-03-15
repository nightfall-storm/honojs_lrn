import { Hono } from "hono";

export const recruiterRoutes = new Hono();

recruiterRoutes.get("/", (c) => {
  return c.json({ message: "Recruiter API" });
});
