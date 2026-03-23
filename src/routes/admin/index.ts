import { OpenAPIHono } from "@hono/zod-openapi";
import { citiesRoutes } from "./cities.routes";

// This nests the cities routes under /api/admin/cities
export const adminRoutes = new OpenAPIHono().route("/cities", citiesRoutes);
