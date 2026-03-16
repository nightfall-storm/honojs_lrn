import { db } from "../../db";
import { cities } from "../../db/schema";

export const cityService = {
  // Fetch everything from the cities table
  getAll: async () => {
    return await db.select().from(cities);
  },

  // Insert a new city and return the created record
  create: async (data: typeof cities.$inferInsert) => {
    const [newCity] = await db.insert(cities).values(data).returning();
    return newCity;
  },
};
