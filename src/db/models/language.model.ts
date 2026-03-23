import { pgTable, uuid, text, boolean } from "drizzle-orm/pg-core";

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
