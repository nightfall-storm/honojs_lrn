import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid().primaryKey(),
  name: text().notNull(),
  email: text().unique().notNull(),
  password: text().notNull(),
  role: text({ enum: ["admin", "user"] }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid().primaryKey(),
  title: text().notNull(),
  description: text().notNull(),
  userId: uuid()
    .notNull()
    .references(() => users.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: uuid().primaryKey(),
  title: text().notNull(),
  description: text().notNull(),
  projectId: uuid()
    .notNull()
    .references(() => projects.id),
  userId: uuid()
    .notNull()
    .references(() => users.id),
  status: text({ enum: ["not_assigned", "in_progress", "done"] }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  tasks: many(tasks),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));
