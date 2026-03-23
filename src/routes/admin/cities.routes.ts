import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { cityService } from "@/services/admin/city.service";
import { selectCitySchema, insertCitySchema } from "@/schemas/city.schema";
import { zValidator } from "@hono/zod-validator";

export const citiesRoutes = new OpenAPIHono();

const CitiesResponseSchema = z.object({
  data: z.array(selectCitySchema),
});

// Define the "Contract" for the GET request
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

// Register the logic
citiesRoutes.openapi(listCitiesRoute, async (c) => {
  const data = await cityService.getAll();
  return c.json({ data }, 200);
});

const createCityRoute = createRoute({
  method: "post",
  path: "/",
  responses: {
    200: {
      content: { "application/json": { schema: insertCitySchema } },
      description: "Create a new city",
    },
  },
  body: insertCitySchema,
});

citiesRoutes.post(
  "/",
  zValidator("json", insertCitySchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: {
            message: "Validation failed",
            details: result.error.issues.map((err) => ({
              // ← Use .issues not .errors
              field: err.path.join("."),
              message: err.message,
              code: err.code,
            })),
          },
        },
        400,
      );
    }
  }),
  async (c) => {
    const data = await cityService.create(c.req.valid("json"));
    return c.json({ success: true, data }, 201);
  },
);

citiesRoutes.openapi(createCityRoute, async (c) => {
  const body = await c.req.json();
  const parsed = insertCitySchema.parse(body);
  const data = await cityService.create(parsed);
  return c.json(data, 200);
});
