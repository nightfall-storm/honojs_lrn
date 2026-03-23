import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { cityService } from "@/services/admin/city.service";
import { selectCitySchema } from "@/schemas/city.schema";

export const citiesRoutes = new OpenAPIHono();

const CitiesResponseSchema = z.object({
  data: z.array(selectCitySchema),
});

// 2. Define the "Contract" for the GET request
const listCitiesRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      content: { "application/json": { schema: CitiesResponseSchema } },
      description: "Retrieve all cities",
    },
  },
});

// 3. Register the logic
citiesRoutes.openapi(listCitiesRoute, async (c) => {
  const data = await cityService.getAll();
  return c.json({ data }, 200);
});
