import { Hono } from "hono";
import { env } from "./env";

const app = new Hono();

app.get("/", (c) => {
  return c.text(`Connected`);
});

export default app;
