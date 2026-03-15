import { Hono } from "hono";

export const candidateRoutes = new Hono();

candidateRoutes.get("/", (c) => {
  return c.json({ message: "Candidate API" });
});
