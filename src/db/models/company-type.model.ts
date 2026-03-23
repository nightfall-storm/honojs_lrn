import { pgTable, uuid, text } from "drizzle-orm/pg-core";

/**
 * `company_types` table
 * Stores classifications for different types of companies (e.g., Startup, Corporation, NGO).
 * Example entry: A company type with id 'm3n4o5p6-...', name 'SaaS Startup', description 'A software-as-a-service startup company.'.
 */
export const companyTypes = pgTable("company_types", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  description: text(),
});
