# TypeStack Full-Stack Boilerplate

TypeStack is a **production-oriented TypeScript starting point** for applications that need a React interface, an authenticated backend, relational data, typed API contracts, and explicit security defaults. The boilerplate is built on the managed React, Vite, Express, tRPC, Drizzle, and OAuth project foundation; it does not introduce a second framework where the provided stack already solves the problem well.

The visual layer adapts the selected [Mytheme](https://github.com/Joelorbit/Mytheme) design system to a **white-first, slate-and-indigo React interface**. Its semantic surfaces, content hierarchy, focus treatment, motion restraint, and reduced-motion behavior are preserved as a practical token direction instead of copying its Svelte components.

## Stack at a Glance

| Area               | Default                                                                 | Where to work                              |
| ------------------ | ----------------------------------------------------------------------- | ------------------------------------------ |
| Web app            | React 19, Vite, Tailwind CSS 4                                          | `src/apps/web/`                            |
| API app            | Express 4 and tRPC 11                                                   | `src/apps/api/src/`                        |
| Authentication     | Managed OAuth and secure server session cookie                          | `src/apps/api/src/_core/`                  |
| Database package   | MySQL/TiDB-compatible relational database and Drizzle ORM               | `src/packages/database/`                   |
| Shared package     | Shared TypeScript constants and types                                   | `src/packages/shared/`                     |
| Runtime validation | Zod 4                                                                   | `src/apps/api/src/env.ts`                  |
| UI primitives      | shadcn-compatible Radix components                                      | `src/apps/web/src/components/ui/`          |
| Security           | Helmet, CORS allowlist, Fetch Metadata/origin guard, request throttling | `src/apps/api/src/security.ts`             |
| Quality            | ESLint flat config, Prettier, Vitest, GitHub Actions                    | Root configuration and API workspace tests |

> **Design rule:** Product code should use semantic Tailwind tokens such as `bg-card`, `text-muted-foreground`, and `border-border`. Avoid scattering raw color values through components.

## Source Monorepo

This repository is a **pnpm workspace monorepo**. All application source is below the root `src/` directory. The root owns shared tooling and the workspace lockfile; each app or package owns its source boundary and a small package manifest.

```text
src/
├── apps/
│   ├── web/              # React + Vite application
│   └── api/              # Express + tRPC application
└── packages/
    ├── database/         # Drizzle schema, relations, and SQL migrations
    └── shared/           # Cross-app constants and type exports
```

Use the workspace aliases `@/`, `@shared/`, and `@db/` rather than reaching across package boundaries with brittle relative paths.

## Local Development

The project uses the version of `pnpm` recorded in `package.json`. Install dependencies once, then start the app. The frontend and backend are served together, so the browser talks to tRPC at the same origin.

```bash
pnpm install
pnpm dev
```

The development server discovers an available port beginning with `3000`. Do not hardcode a runtime port; production supplies `PORT` through the host.

| Command             | Purpose                                                 |
| ------------------- | ------------------------------------------------------- |
| `pnpm dev`          | Run the integrated Vite and Express development server. |
| `pnpm check`        | Run the TypeScript compiler without output.             |
| `pnpm lint`         | Run the ESLint flat configuration.                      |
| `pnpm format`       | Format source files with Prettier.                      |
| `pnpm format:check` | Verify formatting without modifying files.              |
| `pnpm test`         | Run the Vitest suite once.                              |
| `pnpm validate`     | Run linting, TypeScript checks, and tests.              |
| `pnpm build`        | Build the client and bundle the Express runtime.        |

## Configuration

Managed credentials such as `DATABASE_URL`, `JWT_SECRET`, OAuth values, and storage keys are injected by the environment and must never be committed. The application validates its own public operational settings in `src/apps/api/src/env.ts` at startup.

| Variable               | Required | Default       | Purpose                                                                   |
| ---------------------- | -------- | ------------- | ------------------------------------------------------------------------- |
| `NODE_ENV`             | No       | `development` | Selects development, test, or production behavior.                        |
| `APP_ORIGIN`           | No       | Unset         | The canonical browser origin when an explicit one is needed.              |
| `CORS_ORIGINS`         | No       | Unset         | Comma-separated additional browser origins. Each must be an absolute URL. |
| `RATE_LIMIT_WINDOW_MS` | No       | `900000`      | Per-instance rate-limit window in milliseconds.                           |
| `RATE_LIMIT_MAX`       | No       | `100`         | Maximum requests per client in the configured window.                     |

The default is intentionally **same-origin**. Do not set `CORS_ORIGINS` merely because CORS exists. Add only browser origins that you operate and can justify. A shared rate-limit store is recommended before relying on rate limits across horizontally scaled instances.

## Architecture and Feature Workflow

The most important project boundary is the tRPC procedure. New features should follow the path below so schema, access rules, implementation, client types, and tests remain connected.

| Step | Change                                                                             | Verification                                       |
| ---- | ---------------------------------------------------------------------------------- | -------------------------------------------------- |
| 1    | Define or revise tables in `src/packages/database/src/schema.ts`.                  | Generate and inspect migration SQL.                |
| 2    | Add narrow query helpers in `src/apps/api/src/db.ts`.                              | Cover behavior with a Vitest test where feasible.  |
| 3    | Add a public, protected, or admin tRPC procedure in `src/apps/api/src/routers.ts`. | Validate all external input with Zod.              |
| 4    | Call it from React with `trpc.*.useQuery` or `useMutation`.                        | Provide loading, empty, error, and success states. |
| 5    | Update documentation and run `pnpm validate`.                                      | Inspect the working browser flow.                  |

The starter includes protected `bootstrap`, `profile`, and `audit` routers. They demonstrate a user-owned profile record and an append-only audit event without inventing sample accounts or fake customer content.

## Database Migrations

The repository uses a **codebase-first, reviewed SQL migration** workflow. Update the Drizzle schema, generate the migration, review every SQL statement, and apply it through the managed database migration process. Do not treat direct schema push as a replacement for migration review in a collaborative production project.

```bash
pnpm db:generate
```

The generated SQL remains in `src/packages/database/migrations/`. The initial starter migration creates `profiles` and `auditEvents` in addition to the managed `users` table.

## Security Baseline

Authentication, authorization, and request origin are separate controls. OAuth establishes the authenticated user, protected procedures reject unauthenticated users, and the browser request policy rejects unsafe cross-site requests before business logic runs. Cookies are HTTP-only and scoped to `/`; production HTTPS determines the secure attribute.

| Control         | Default behavior                                                             |
| --------------- | ---------------------------------------------------------------------------- |
| CORS            | Same-origin by default; exact origin allowlist only when configured.         |
| CSRF resistance | Fetch Metadata policy for unsafe methods plus origin validation.             |
| Request ID      | A valid inbound ID is preserved or a new UUID is issued in `x-request-id`.   |
| HTTP headers    | Helmet applies baseline browser-security headers; production CSP is enabled. |
| Payload sizes   | JSON and URL-encoded requests are capped at 1 MB.                            |
| Rate limiting   | Per-instance request throttling uses environment-controlled limits.          |
| Input parsing   | tRPC procedure inputs use Zod before data access.                            |
| Audit trail     | Profile mutations create a small append-only audit event.                    |

Review [`docs/stack-decisions.md`](docs/stack-decisions.md) for the research notes and source references behind these choices.

## Deployment

This is a normal Node and Vite application. The managed deployment environment automatically creates the container image, so the project deliberately contains **no custom Dockerfile**. A custom image should be introduced only if production genuinely needs another runtime or system binary.

Before publishing, run `pnpm validate`, create a project checkpoint, and use the hosting interface's Publish action. The included GitHub Actions workflow performs the same quality gates for repository pushes and pull requests.

## Durable Operations

For long-lived use, read [`docs/operations.md`](docs/operations.md). It covers Autoscale versus Reserved Hosting, release validation, migration safety, backup discipline, secret handling, repository handoff, and recovery. Use Reserved Hosting when the application needs one Node process running continuously; use Autoscale for ordinary stateless request traffic.
