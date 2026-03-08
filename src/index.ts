import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text(`Connected`);
});

export default app;
