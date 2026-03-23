import { OpenAPIHono } from "@hono/zod-openapi";
import { citiesRoutes } from "@/routes/admin/cities.routes";

// This nests the cities routes under /api/admin/cities
export const adminRoutes = new OpenAPIHono().route("/cities", citiesRoutes);
