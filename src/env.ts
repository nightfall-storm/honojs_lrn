import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    JWT_SECRET: z.string().min(1),
  },
  // Use process.env directly so it works anywhere in your Bun app
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
