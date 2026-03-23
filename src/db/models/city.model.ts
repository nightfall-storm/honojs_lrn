import { pgTable, uuid, text } from "drizzle-orm/pg-core";

/**
 * `cities` table
 * Stores information about cities where jobs or companies may be located.
 * Example entry: A city with id 'a1b2c3d4-...', name 'Berlin', code 'BER', country 'Germany'.
 */
export const cities = pgTable("cities", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  code: text().notNull(),
  country: text().notNull(),
});
