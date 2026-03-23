import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { cities } from "@/db/schema";
import { z } from "zod";

// 1. Generate the base schema from the DB table
export const insertCitySchema = createInsertSchema(cities, {
  // 2. Override or add custom validation logic here
  name: (schema) => schema.min(2, "City name is too short"),
  code: (schema) => schema.length(3, "Must be a 3-letter ISO code"),
  country: (schema) => schema.min(2, "Country name is too short"),
});

// 3. For selecting data (responses), usually the default is fine
export const selectCitySchema = createSelectSchema(cities);

// 4. Create a schema for updates (makes all fields optional)
export const updateCitySchema = insertCitySchema.partial();

// 5. Export types for use in your Frontend (Next.js)
export type CityInsert = z.infer<typeof insertCitySchema>;
export type City = z.infer<typeof selectCitySchema>;
