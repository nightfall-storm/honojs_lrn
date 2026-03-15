import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
// import { relations } from "drizzle-orm";

/**
 * Enumeration for user roles within the application.
 * Defines the possible roles a user can have: admin, recruiter, or candidate.
 */
export const roleEnum = pgEnum("role", ["admin", "recruiter", "candidate"]);

/**
 * `users` table
 * Stores core user account information.
 * Example entry: A user with id '123e4567-e89b-12d3-a456-426614174000', name 'John Doe', email 'john@example.com', role 'candidate'.
 */
export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().unique().notNull(),
  password: text().notNull(),
  role: roleEnum().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

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

/**
 * `languages` table
 * Stores supported languages for the platform, including display and layout properties.
 * Example entry: A language with id 'e5f6g7h8-...', name 'English', flag '🇺🇸', code 'en', rtl false, country_code 'US'.
 */
export const languages = pgTable("languages", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  flag: text().notNull(),
  code: text().notNull(),
  rtl: boolean().notNull(),
  country_code: text(),
});

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
