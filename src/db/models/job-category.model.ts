import { pgTable, uuid, text } from "drizzle-orm/pg-core";

/**
 * `job_categories` table
 * Stores high-level categories for job postings (e.g., Engineering, Marketing, Sales).
 * Example entry: A job category with id 'q7r8s9t0-...', name 'Backend Engineering', description 'Roles focused on server-side logic and databases.'.
 */
export const jobCategories = pgTable("job_categories", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  description: text(),
});
