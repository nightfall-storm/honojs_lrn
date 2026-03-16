import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { cityService } from "../../services/admin/city.service";

// 1. Define the Schema for a City (Validation)
const CitySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  code: z.string(),
  country: z.string(),
});

export const citiesRoutes = new OpenAPIHono();

// 2. Define the "Contract" for the GET request
const listCitiesRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: { "application/json": { schema: z.array(CitySchema) } },
      description: "Retrieve all cities",
    },
  },
});

// 3. Register the logic
citiesRoutes.openapi(listCitiesRoute, async (c) => {
  const data = await cityService.getAll();
  return c.json({ data }, 200);
});
