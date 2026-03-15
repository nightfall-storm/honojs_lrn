import { Hono } from "hono";
import { recruiterRoutes } from "./routes/recruiter";
import { candidateRoutes } from "./routes/candidate";
import { adminRoutes } from "./routes/admin";

const app = new Hono().basePath("/api");

// "Microservices" inside your Monolith
const routes = app
  .route("/admin", adminRoutes)
  .route("/recruiter", recruiterRoutes)
  .route("/candidate", candidateRoutes);

export default app;
export type AppType = typeof routes;
