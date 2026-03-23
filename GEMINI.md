# GEMINI.md - Job Board API (Taskflows Learn)

## Project Overview
A backend API for a Job Board application built with **Bun**, **Hono** (using Zod OpenAPI), and **Drizzle ORM** (PostgreSQL). The project follows a service-oriented architecture with clear separation between routes, services, and the data layer.

### Main Technologies
- **Runtime**: Bun
- **Web Framework**: Hono (with `@hono/zod-openapi` and `@scalar/hono-api-reference`)
- **ORM**: Drizzle ORM (with `postgres.js` driver)
- **Validation**: Zod (and `drizzle-zod`)
- **Environment Management**: `@t3-oss/env-core`

## Building and Running
The project uses Bun as its primary runner and package manager.

- **Installation**: `bun install`
- **Development**: `bun run dev` (runs with `--hot` reload)
- **Database Migrations**:
  - Generate: `bun run db:generate`
  - Apply: `bun run db:migrate`
  - Push (Schema Sync): `bun run db:push`
- **Database Studio**: `bun run db:studio`
- **Environment Check**: `bun run env:check`
- **Database Connection Test**: `bun run db:ping`

## Architecture & Directory Structure
- `src/index.ts`: Entry point, defines OpenAPI documentation and mounts routes.
- `src/env.ts`: Centralized, type-safe environment variable configuration.
- `src/db/`: Database configuration and schema definitions.
  - `schema.ts`: Exports all models.
  - `models/`: Individual table definitions (e.g., `user.model.ts`, `city.model.ts`).
- `src/routes/`: API endpoint definitions using Hono. Separated by roles: `admin`, `recruiter`, `candidate`.
- `src/services/`: Business logic layer, interacts with the database.
- `src/schemas/`: Shared Zod schemas for request/response validation (often extending Drizzle schemas).

## Development Conventions

### Routing & Validation
- **OpenAPI Integration**: Use `createRoute` from `@hono/zod-openapi` to define route contracts (method, path, request/response schemas).
- **Zod Validator**: Use `zValidator` middleware for request body/param validation.
- **Error Handling**: When manual validation fails, return a 400 Bad Request with a structured error object containing `issues` from Zod.

### Database (Drizzle ORM)
- **Schema Location**: Define new tables in `src/db/models/` and export them in `src/db/schema.ts`.
- **Imports**: Use the `@/` alias for absolute imports within the `src` directory.
- **Transactions**: Use `db.transaction` for operations involving multiple related inserts/updates.

### Environment Variables
Required variables in `.env`:
- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: Secret key for JWT signing/verification.

### Code Style
- **Indentation**: 2 spaces.
- **Formatting**: Semicolons are optional but consistently used in existing code; single quotes are preferred for strings.
- **Naming**: 
  - Tables: snake_case (e.g., `job_categories`).
  - Variables/Functions: camelCase.
  - Classes/Types/Models: PascalCase.
