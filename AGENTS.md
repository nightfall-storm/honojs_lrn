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
- **Zod v4 Error Handling**: Use `result.error.issues` (not `.errors`) for validation errors
- **Validation Errors**: Return 400 Bad Request with structured error details, not 500
- **Use `@hono/zod-validator`** for automatic validation with proper error responses

### Validation Patterns

**Preferred: Using `@hono/zod-validator`**

```typescript
import { zValidator } from "@hono/zod-validator";

app.post("/tasks", 
  zValidator("json", insertSchema),
  async (c) => {
    const data = await service.create(c.req.valid("json"));
    return c.json(data, 200);
  }
);
```

**Alternative: Manual validation with `safeParse`**

```typescript
import { z } from "zod";

app.post("/tasks", async (c) => {
  const body = await c.req.json();
  const result = inputSchema.safeParse(body);
  
  if (!result.success) {
    return c.json({
      success: false,
      error: {
        message: "Validation failed",
        details: result.error.issues.map(err => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code
        }))
      }
    }, 400);
  }
  
  const data = await service.create(result.data);
  return c.json(data, 200);
});
```

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

## Backend Best Practices

### Security

**Input Validation**
- Always validate and sanitize external input using Zod schemas
- Never trust client-side validation alone
- Use `@hono/zod-validator` middleware for automatic validation
- Validate request body, query parameters, and route params

**Authentication & Authorization**
- Implement JWT-based authentication with secure secret management
- Use middleware for route protection
- Implement role-based access control (RBAC)
- Validate permissions at both route and service layer
- Never expose sensitive data in responses (passwords, tokens, etc.)

**Database Security**
- Use parameterized queries (Drizzle ORM handles this by default)
- Never concatenate user input into SQL queries
- Implement row-level security where appropriate
- Use database transactions for multi-step operations
- Sanitize sort fields and column names in dynamic queries

**API Security**
- Implement rate limiting for public endpoints
- Use CORS with explicit allowed origins
- Set secure HTTP headers (helmet, Hono's secure headers)
- Implement request size limits
- Use HTTPS in production
- Sanitize error messages (don't leak stack traces to clients)

**Environment & Secrets**
- Never commit `.env` files or secrets to version control
- Use environment variables for all configuration
- Validate environment variables at startup with Zod
- Use different secrets for development, staging, and production
- Rotate secrets periodically

### File Naming & Organization

**File Naming Conventions**
```
*.routes.ts       # Route definitions
*.service.ts      # Business logic services
*.schema.ts       # Zod schemas
*.types.ts        # TypeScript types/interfaces
*.constant.ts     # Constants and config values
*.util.ts         # Utility functions
*.middleware.ts   # Middleware functions
*.test.ts         # Test files
```

**Directory Structure**
```
src/
├── index.ts              # Application entry point
├── env.ts                # Environment validation
├── db/
│   ├── index.ts          # Database connection
│   └── schema.ts         # Database tables & relations
├── schemas/              # Zod validation schemas
│   └── *.schema.ts
├── services/             # Business logic layer
│   └── *.service.ts
├── routes/               # API route handlers
│   ├── public/           # Public endpoints
│   └── admin/            # Protected endpoints
├── middleware/           # Custom middleware
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── types/                # Shared TypeScript types
│   └── *.types.ts
└── utils/                # Utility functions
    └── *.util.ts
```

### API Design

**HTTP Status Codes**
- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST (resource created)
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid input/validation errors
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Valid auth but insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Resource conflict (duplicate, etc.)
- `422 Unprocessable Entity` - Validation errors (alternative to 400)
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server-side errors

**Response Format**
```typescript
// Success response
{
  success: true,
  data: { /* response data */ }
}

// Error response
{
  success: false,
  error: {
    message: "Human-readable error message",
    code: "ERROR_CODE",
    details: [/* validation errors */]
  }
}
```

**Route Naming**
- Use plural nouns for collections: `/users`, `/projects`, `/tasks`
- Use nested routes for relationships: `/users/:userId/projects`
- Use HTTP methods semantically (GET, POST, PUT, DELETE, PATCH)
- Version your API: `/api/v1/users`

**Pagination**
```typescript
// Query params
?page=1&limit=20&sort=created_at&order=desc

// Response
{
  data: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 100,
    totalPages: 5
  }
}
```

### Database Best Practices

**Schema Design**
- Use singular table names: `users`, `projects`, `tasks`
- Always include `id`, `created_at`, `updated_at` columns
- Use appropriate data types (UUID vs integer, text vs varchar)
- Add indexes on frequently queried columns
- Define foreign keys with proper constraints
- Use `ON DELETE CASCADE` or `SET NULL` appropriately

**Query Optimization**
- Use `SELECT` with specific columns instead of `SELECT *`
- Add indexes for WHERE, JOIN, and ORDER BY clauses
- Use database transactions for related operations
- Implement query result caching where appropriate
- Avoid N+1 queries with proper JOINs or batch loading
- Use `EXPLAIN ANALYZE` to debug slow queries

**Migrations**
- Always create migrations for schema changes
- Write reversible migrations (up/down)
- Test migrations on staging before production
- Never modify existing migrations (create new ones)
- Keep migrations small and focused

### TypeScript Best Practices

**Type Safety**
- Enable strict mode in `tsconfig.json`
- Use explicit return types for functions
- Avoid `any` - use `unknown` when type is uncertain
- Use TypeScript's utility types (`Partial`, `Pick`, `Omit`, etc.)
- Infer types from schemas where possible with `z.infer<>`

**Error Handling**
```typescript
// Use try-catch for async operations
try {
  const result = await db.query();
  return c.json(result);
} catch (error) {
  // Log the full error
  console.error("Database error:", error);
  
  // Return sanitized error to client
  return c.json({
    success: false,
    error: { message: "Failed to fetch data" }
  }, 500);
}

// Use custom error classes for domain errors
class AppError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string
  ) {
    super(message);
  }
}
```

**Code Organization**
- Keep functions small and focused (single responsibility)
- Use early returns to reduce nesting
- Extract reusable logic into utility functions
- Use constants for magic numbers and strings
- Document complex business logic with comments

### Performance

**Caching Strategies**
- Cache expensive database queries
- Use Redis or in-memory cache for frequently accessed data
- Implement cache invalidation strategies
- Set appropriate cache headers for GET requests

**Database Performance**
- Use connection pooling (configured in Drizzle)
- Implement query timeouts
- Monitor slow queries
- Use read replicas for read-heavy workloads

**API Performance**
- Implement pagination for list endpoints
- Use field selection to limit response size: `?fields=id,name,email`
- Compress responses with gzip/brotli
- Implement request debouncing on client side

### Logging & Monitoring

**Logging**
```typescript
// Structured logging
console.log({
  level: "info",
  message: "User created",
  userId: user.id,
  timestamp: new Date().toISOString()
});

// Error logging
console.error({
  level: "error",
  message: "Database connection failed",
  error: error.message,
  stack: error.stack,
  timestamp: new Date().toISOString()
});
```

**Monitoring**
- Log all errors with context
- Track API response times
- Monitor database query performance
- Set up alerts for critical errors
- Track business metrics (user signups, task completions, etc.)

### Testing

**Test Organization**
- Place tests next to source files: `*.test.ts`
- Use descriptive test names: `should return 400 when email is invalid`
- Test happy path, edge cases, and error scenarios
- Mock external dependencies (database, APIs)

**Test Coverage**
- Test all service layer functions
- Test route handlers with mocked services
- Test database queries and migrations
- Test authentication and authorization
- Test validation schemas

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

### API Route with Validation (Recommended):

```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const inputSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
});

const app = new Hono();

app.post("/tasks",
  zValidator("json", inputSchema),
  async (c) => {
    const data = c.req.valid("json");
    const result = await db.insert(tasks).values(data).returning();
    return c.json(result[0], 200);
  }
);
```

### Database query with manual validation:

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
  const result = inputSchema.safeParse(body);
  
  if (!result.success) {
    // Zod v4: use .issues not .errors
    return c.json({
      success: false,
      error: {
        message: "Validation failed",
        details: result.error.issues.map(err => ({
          field: err.path.join("."),
          message: err.message
        }))
      }
    }, 400);
  }
  
  const result = await db.insert(tasks).values(result.data).returning();
  return c.json(result[0], 200);
});
```

### Environment variable access:

```typescript
import { env } from "../env";

// Use env.VARIABLE_NAME directly - it's validated at startup
const dbUrl = env.DATABASE_URL;
```
