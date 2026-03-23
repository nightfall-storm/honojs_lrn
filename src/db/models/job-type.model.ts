import { pgTable, uuid, text } from "drizzle-orm/pg-core";

/**
 * `job_types` table
 * Stores specific job types or work arrangements (e.g., Remote, On-site, Hybrid).
 * Example entry: A job type with id 'y5z6a7b8-...', name 'Remote', description 'Work can be done from any location.'.
 */
export const jobTypes = pgTable("job_types", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  description: text(),
});
