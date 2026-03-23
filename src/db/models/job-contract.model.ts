import { pgTable, uuid, text } from "drizzle-orm/pg-core";

/**
 * `job_contracts` table
 * Stores types of employment contracts (e.g., Full-time, Part-time, Contract, Internship).
 * Example entry: A job contract with id 'u1v2w3x4-...', name 'Full-time', description 'A standard full-time employment contract.'.
 */
export const jobContracts = pgTable("job_contracts", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  description: text(),
});
