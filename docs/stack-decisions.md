# TypeScript Full-Stack Boilerplate: Engineering Decisions

## Purpose

This boilerplate is designed as a **single TypeScript repository** for a browser application and its backend. It retains the managed project's supported React, Express, tRPC, Drizzle, and Manus OAuth foundation instead of replacing working infrastructure with a second, competing stack. The result is deliberately pragmatic: types flow from server procedures to the React client, authentication is provided by a session cookie, and schema changes are versioned as reviewed SQL migrations.

| Concern                | Chosen default                                                                   | Rationale                                                                                                                                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Client                 | React 19, Vite, Tailwind CSS 4                                                   | This is the existing, supported frontend runtime and gives a fast TypeScript development loop.                                                                                                             |
| Server API             | Express 4 with tRPC 11                                                           | tRPC exposes typed procedures to the React client without duplicated REST client contracts or code generation.[1]                                                                                          |
| Authentication         | Managed OAuth, server-issued secure session cookie                               | The platform already provisions OAuth callback handling and authenticated request context; the boilerplate layers protected procedures and frontend access checks over that foundation.                    |
| Database               | MySQL/TiDB-compatible relational database with Drizzle ORM                       | The managed project includes this database integration. Relational models and explicit migrations are suited to user-owned application data. Drizzle supports a codebase-first, SQL-migration workflow.[2] |
| Validation             | Zod 4, shared for procedure input and forms                                      | Zod is TypeScript-first, works in both Node and browsers, and supports strict TypeScript projects.[3]                                                                                                      |
| Client data            | TanStack Query through the tRPC React adapter                                    | Typed queries, mutations, cache invalidation, loading states, and error states stay consistent across the application.                                                                                     |
| UI                     | Tailwind CSS 4, shadcn-compatible primitives, Eyu Light-inspired semantic tokens | The selected Mytheme repository supplies a mature token vocabulary. Its white, semantic light canvas will be adapted rather than copying its Svelte implementation.                                        |
| Tests                  | Vitest                                                                           | Vitest runs against the Vite ecosystem, supports TypeScript, and can use a dedicated test configuration when needed.[4]                                                                                    |
| Linting and formatting | ESLint flat config, typescript-eslint, Prettier                                  | Flat configuration and TypeScript-aware recommended/strict rules are the current documented path for ESLint-based TypeScript linting.[5]                                                                   |

## Authentication and Authorization

Authentication is deliberately separated from authorization. The managed OAuth flow establishes the signed-in user and stores the session in an HTTP-only cookie. Backend procedures use one of three tiers: public procedures for unauthenticated data, protected procedures for an authenticated user, and administrative procedures for roles that require elevated access. The browser never receives or manually manipulates the session cookie.

The starter data model extends the managed `users` table with a user-owned `profiles` table and a small `auditEvents` table. The profile demonstrates a protected database record; the audit table makes security-significant changes traceable without creating fake user data.

## Database and Migrations

Drizzle schema definitions are maintained in `src/packages/database/src/schema.ts`, with reviewed SQL migrations in `src/packages/database/migrations/`. Every schema alteration must be generated as a migration, reviewed as SQL, and then applied in a controlled environment. The project documentation will describe this as the standard path rather than treating `push` as a substitute for production migration review.[2]

The MySQL/TiDB-compatible choice is intentional. It matches the available managed database, supports normalized relations and transactions, and avoids unnecessary operational complexity. A future PostgreSQL variant should be created as a separate adapter rather than mixing database dialects in one starter.

## API, Validation, and Errors

tRPC procedures are the internal application API contract. Zod schemas validate external input at the server boundary before business logic or database access. Procedures return intentionally shaped objects; they do not expose database internals by default. Error messages shown to users remain concise, while server-side logs preserve a request identifier and the technical cause for investigation.

REST endpoints are reserved for cases in which an external system requires HTTP resources, such as a signed webhook. Those endpoints must use explicit authentication, a narrow schema, and a separate threat review. The normal browser application should call tRPC instead of adding ad hoc `fetch` or Axios wrappers.

## CORS, CSRF, and Browser Security

The default deployment serves the client and API from the same origin, so the boilerplate does not enable permissive cross-origin access. When a separate browser origin is genuinely required, CORS must use an exact allowlist from configuration; it must never return a wildcard or blindly reflect `Origin` for authenticated traffic.[6]

Cookie-authenticated mutations will also use Fetch Metadata and origin checks. Cross-site unsafe requests are rejected, while safe methods remain non-mutating. This follows OWASP guidance to defend state-changing requests with layered controls, avoid state-changing GET requests, and treat `SameSite` as a supplemental control rather than the only defense.[7]

| Security default | Implementation rule                                                                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cookies          | HTTP-only, secure in production, scoped to `/`, and set through the server only.                                                                                     |
| CORS             | Disabled by default for same-origin use; exact `APP_ORIGIN` allowlist only when enabled.                                                                             |
| CSRF             | Reject cross-site unsafe requests with Fetch Metadata; validate origin as a fallback; add an anti-CSRF token before deliberately supporting cross-site cookie calls. |
| Inputs           | Parse all procedure inputs using Zod; reject malformed payloads before database queries.                                                                             |
| Headers          | Apply baseline security headers and prevent MIME sniffing and framing by default.                                                                                    |
| Secrets          | Read only from environment variables; never commit `.env` values.                                                                                                    |
| Logging          | Record request IDs and safe error context; never log session values, authorization headers, or secrets.                                                              |

## Frontend Theme Direction

The frontend will use a **white-first Eyu Light adaptation**. It will keep the selected Mytheme repository's semantic approach—surface layers, content tiers, accent pairings, focus ring, spacing, elevation, and reduced-motion behavior—while translating it from Svelte styles into the existing React and Tailwind environment. Product components will use semantic classes and CSS custom properties rather than scattered hex values.

The initial screen is a working boilerplate dashboard, not a generic marketing page. It will show session state, a protected profile record, service health, configuration guidance, and the current security posture. This demonstrates all major wiring without inventing reviews, ratings, or testimonials.

## Source References

[1]: https://trpc.io/docs/ "tRPC documentation"
[2]: https://orm.drizzle.team/docs/migrations "Drizzle ORM migrations"
[3]: https://zod.dev/ "Zod documentation"
[4]: https://vitest.dev/guide/ "Vitest getting started"
[5]: https://typescript-eslint.io/getting-started/ "typescript-eslint getting started"
[6]: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/07-Testing_Cross_Origin_Resource_Sharing "OWASP Testing Cross-Origin Resource Sharing"
[7]: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html "OWASP Cross-Site Request Forgery Prevention Cheat Sheet"
