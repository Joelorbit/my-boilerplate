# Configuration Reference

The managed platform supplies the sensitive values required for OAuth, database access, storage, and session signing. This document covers only application-level operational configuration parsed by `src/apps/api/src/env.ts`. Values must be set through the environment configuration interface rather than committed to a file.

| Variable               | Accepted format                       | Example                                                 | Notes                                           |
| ---------------------- | ------------------------------------- | ------------------------------------------------------- | ----------------------------------------------- |
| `APP_ORIGIN`           | Absolute HTTP(S) URL                  | `https://app.example.com`                               | Normalized to its origin; paths are ignored.    |
| `CORS_ORIGINS`         | Comma-separated absolute HTTP(S) URLs | `https://admin.example.com,https://preview.example.com` | Adds explicit browser origins to the allowlist. |
| `RATE_LIMIT_WINDOW_MS` | Positive integer, at most 86,400,000  | `900000`                                                | Per-instance enforcement window.                |
| `RATE_LIMIT_MAX`       | Positive integer, at most 10,000      | `100`                                                   | Requests permitted per client in the window.    |

`CORS_ORIGINS` is not required for the normal combined frontend and backend deployment. For cookie-authenticated cross-origin browser traffic, configure a precise allowlist and add an anti-CSRF token flow before enabling the client. The baseline Fetch Metadata and origin checks remain defense in depth, not an excuse to make a broad trust policy.
