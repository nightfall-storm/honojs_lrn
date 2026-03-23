import { pgTable, uuid, text } from "drizzle-orm/pg-core";

/**
 * `skills` table
 * Stores predefined skills that candidates can possess or jobs can require.
 * Example entry: A skill with id 'i9j0k1l2-...', name 'TypeScript', description 'A strongly typed programming language that builds on JavaScript.'.
 */
export const skills = pgTable("skills", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  description: text(),
});
