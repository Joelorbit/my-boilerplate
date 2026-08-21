# Operations Guide

This project is designed to remain useful as a long-lived starter. The code is stored as a pnpm workspace monorepo, the database is migration-driven, and production configuration is supplied through managed environment variables rather than committed files.

## Long-Lived Hosting

The default managed hosting mode is Autoscale. It is appropriate for a stateless web application and can scale down when idle. For a process that must stay alive continuously—such as a WebSocket connection, in-memory room state, or a background worker—use the managed Reserved Hosting mode instead of relying on a development process or an inactive sandbox.

Reserved Hosting runs one persistent Node process 24/7 behind the managed HTTPS URL. It keeps the same application and deployment workflow, but it has fixed limits of 1 vCPU and 512 MB RAM. Full utilization is usage-based and can reach approximately $37.50 per month before the included $10 monthly usage credit; egress is metered separately. Autoscale remains the simpler and cheaper option when the application only needs to answer HTTP requests.

| Requirement                                                               | Recommended mode                                        |
| ------------------------------------------------------------------------- | ------------------------------------------------------- |
| Normal web app with stateless API requests                                | Autoscale                                               |
| No cold starts or one always-running Node process                         | Reserved Hosting                                        |
| Docker, root access, fixed IP, extra runtimes, or more than 1 vCPU/512 MB | Persistent Cloud Computer or an external cloud provider |

Do not run the app with `pnpm dev` as a production service. Before enabling permanent hosting, set production secrets through the hosting interface, run the full validation commands, create a checkpoint, and publish from the project management interface.

## Release Checklist

Run the following before each release:

```bash
pnpm install --frozen-lockfile
pnpm validate
pnpm format:check
pnpm build
```

Then review the generated database migration, check the live environment variables, and confirm that the health and authentication flows work in the preview. Publish only from a saved checkpoint so the exact release can be rolled back.

## Database Safety

Schema changes begin in `src/packages/database/src/schema.ts`. Generate SQL with `pnpm db:generate`, inspect every statement in `src/packages/database/migrations/`, and apply the migration through the managed database workflow. Never use destructive SQL casually against a production database. Treat database backups and restore tests as part of the deployment process, not as an afterthought.

The application stores file bytes in managed object storage rather than database columns. Database records should contain references and metadata only. Keep migration files and application source in Git, but never commit database credentials, OAuth secrets, JWT signing keys, or production `.env` files.

## Configuration and Secrets

The repository includes `.env.example` for local public configuration. Sensitive values are injected by the environment. Required managed values include the database connection, session signing secret, OAuth configuration, and storage configuration. Public operational controls include `APP_ORIGIN`, `CORS_ORIGINS`, `RATE_LIMIT_WINDOW_MS`, and `RATE_LIMIT_MAX`.

Keep CORS same-origin unless a separate browser client is genuinely required. If cross-origin cookies are introduced, document the exact allowed origins and add a dedicated anti-CSRF token flow before enabling the client.

## Repository Handoff

The intended Git workflow is:

```bash
git status
git diff --stat
pnpm validate
git add .
git commit -m "chore: prepare TypeStack monorepo starter"
git push
```

The final remote must be selected deliberately. Do not overwrite an existing repository containing unrelated work. If the remote is unknown, inspect it first with `git remote -v` and confirm the target repository before pushing.

## Recovery

If a release introduces a code regression, roll back to the previous project checkpoint. If a migration has already changed the remote database, a code rollback does not restore database data; use the database backup and restoration procedure separately. Record the incident, the checkpoint used, the migration state, and the corrective action in the project documentation.

## Routine Maintenance

Update dependencies in a controlled branch, run the complete quality gate, and inspect changelogs for major upgrades. Review the rate-limit settings as traffic grows, rotate secrets on a schedule, test database restores, and keep the deployment mode aligned with the workload. The starter is intentionally conservative so product features can be added without hiding these operational decisions.
