# Source Monorepo Architecture

TypeStack uses a **single pnpm workspace monorepo** whose application code lives entirely below `src/`. The workspace structure gives the web app, API app, database package, and shared package clear ownership without adding a separate repository or duplicating dependency management.

| Workspace               | Responsibility                                                                      | Primary entry point                   |
| ----------------------- | ----------------------------------------------------------------------------------- | ------------------------------------- |
| `src/apps/web`          | React interface, layout, tokens, and browser-side tRPC client.                      | `src/apps/web/src/main.tsx`           |
| `src/apps/api`          | Express server, OAuth boundary, tRPC routers, data access, and security middleware. | `src/apps/api/src/_core/index.ts`     |
| `src/packages/database` | Drizzle schema, relations, and generated SQL migrations.                            | `src/packages/database/src/schema.ts` |
| `src/packages/shared`   | Shared constants and type exports used across app boundaries.                       | `src/packages/shared/src/`            |

The root `package.json` remains the command surface for development, validation, building, and migrations. `pnpm-workspace.yaml` registers each source workspace and holds shared pnpm settings. This keeps the managed full-stack host compatible while leaving a conventional layout for future extraction into independently deployable applications.

## Import Boundaries

| Alias      | Resolves to                  | Intended use                         |
| ---------- | ---------------------------- | ------------------------------------ |
| `@/`       | `src/apps/web/src/`          | Web application imports.             |
| `@shared/` | `src/packages/shared/src/`   | Constants and shared type contracts. |
| `@db/`     | `src/packages/database/src/` | Database schema types and tables.    |

The web application imports `AppRouter` as a type from the API workspace so tRPC continues to provide end-to-end inference. The API imports database tables from `@db/` and shared constants from `@shared/`. Runtime source does not depend on a generated client or copied API contract.

## Theme Direction

The web workspace uses a **white canvas with neutral slate surfaces and an indigo accent**. The color treatment intentionally avoids green while retaining semantic tokens, visible focus states, accessible contrast, and restrained motion from the selected design-system direction.
