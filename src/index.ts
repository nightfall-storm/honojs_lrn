import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { adminRoutes } from "@/routes/admin";
import { recruiterRoutes } from "@/routes/recruiter";
import { candidateRoutes } from "@/routes/candidate";

const app = new OpenAPIHono().basePath("/api");

app.doc("/specification", {
  openapi: "3.1.0",
  info: { title: "Job Board API", version: "1.0.0" },
});

app.get("/docs", Scalar({ url: "/api/specification" }));

const routes = app
  .route("/admin", adminRoutes)
  .route("/recruiter", recruiterRoutes)
  .route("/candidate", candidateRoutes);

export default app;
export type AppType = typeof routes;
