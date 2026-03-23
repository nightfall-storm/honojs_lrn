import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

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
