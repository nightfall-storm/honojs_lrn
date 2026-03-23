# AGENTS.md - Taskflows Learn Project Guide

## Project Overview

This is a Bun-based TypeScript project using Hono for the web framework, Drizzle ORM with PostgreSQL, and Zod for validation. The project implements a task management API with users, projects, and tasks.

## Build & Development Commands

```bash
# Install dependencies
bun install

# Run development server (hot reload)
bun run dev

# Database commands
bun run db:generate    # Generate Drizzle migrations
bun run db:migrate     # Run pending migrations
bun run db:push        # Push schema changes to database
bun run db:studio      # Open Drizzle Studio
bun run db:ping        # Test database connection

# Environment
bun run env:check      # Validate environment variables
```

**Running a single test:** There are no test commands configured. If tests are added, run with `bun test`.

**Running typecheck:** Use `bun -e 'import "./src/env.ts"'` or compile with `bun build`.

## Code Style Guidelines

### General Principles

- Use TypeScript with strict mode enabled
- Prefer explicit type annotations for function parameters and return types
- Use named exports for modules
- Use absolute imports for external packages, relative imports for local modules

### Import Conventions

```typescript
// External packages - named imports
import { Hono } from "hono";
import { drizzle } from "drizzle-orm/postgres-js";
import { z } from "zod";

// Local modules - relative imports
import { env } from "../env";
import * as schema from "./schema";
```

### Naming Conventions

- **Variables/functions**: camelCase (`db`, `queryClient`, `getUserById`)
- **Types/Classes**: PascalCase (`User`, `Project`, `Task`)
- **Database tables**: snake_case singular (`users`, `projects`, `tasks`)
- **Constants**: SCREAMING_SNAKE_CASE for config values

### TypeScript Guidelines

- Enable strict mode in tsconfig.json
- Use `zod` for runtime validation of external input (env vars, API requests)
- Use `@t3-oss/env-core` for type-safe environment variables
- Always type async function returns

### Database (Drizzle ORM)

- Define schemas in `src/db/schema.ts`
- Use `pgTable` for PostgreSQL tables
- Use `relations` for defining relationships
- Use `pgEnum` for enumerated types
- Always define foreign keys with explicit references

### Error Handling

- Let errors propagate naturally in development
- Use try-catch for async database operations
- Return appropriate HTTP status codes in Hono handlers
- Use Zod for request validation

### Formatting

- Use 2 spaces for indentation
- No semicolons at end of statements
- Single quotes for strings
- Trailing commas in objects and arrays
- Maximum line length: 100 characters

### File Organization

```
src/
├── index.ts          # Main app entry point
├── env.ts            # Environment variables and validation
├── core/             # Core business logic (future: schemas, utils)
├── db/
│   ├── index.ts      # Database connection and drizzle instance
│   └── schema.ts     # Database schema definitions
├── middleware/       # Express/Hono middleware (future)
├── routes/           # API route handlers (future)
└── services/        # Business logic services (future)
```

## Environment Variables

Required in `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key
```

## Dependencies

- **Runtime**: Bun
- **Web**: Hono
- **Database**: Drizzle ORM, postgres
- **Validation**: Zod
- **Env**: @t3-oss/env-core

## Common Patterns

### Creating a new route:

```typescript
import { Hono } from "hono";

const app = new Hono();

app.get("/route", async (c) => {
  // Your handler logic
  return c.json({ data: "result" });
});
```

### Database query with Zod validation:

```typescript
import { z } from "zod";
import { db } from "../db";
import { tasks } from "../db/schema";

const inputSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
});

app.post("/tasks", async (c) => {
  const body = await c.req.json();
  const parsed = inputSchema.parse(body);
  
  const result = await db.insert(tasks).values(parsed).returning();
  return c.json(result[0]);
});
```

### Environment variable access:

```typescript
import { env } from "../env";

// Use env.VARIABLE_NAME directly - it's validated at startup
const dbUrl = env.DATABASE_URL;
```
