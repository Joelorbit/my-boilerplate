import { z } from "zod";

const originSchema = z
  .string()
  .url("must be an absolute URL, such as https://app.example.com")
  .transform(value => new URL(value).origin);

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  APP_ORIGIN: originSchema.optional(),
  CORS_ORIGINS: z.string().trim().optional(),
  RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .max(86_400_000)
    .default(900_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().max(10_000).default(100),
});

function parseOrigins(value: string | undefined): string[] {
  if (!value) return [];

  return Array.from(
    new Set(value.split(",").map(origin => originSchema.parse(origin.trim())))
  );
}

export function parseServerEnv(raw: Record<string, string | undefined>) {
  const parsed = serverEnvSchema.parse(raw);
  const corsOrigins = parseOrigins(parsed.CORS_ORIGINS);
  const appOrigin = parsed.APP_ORIGIN;

  return {
    nodeEnv: parsed.NODE_ENV,
    isProduction: parsed.NODE_ENV === "production",
    appOrigin,
    allowedOrigins: Array.from(
      new Set([...(appOrigin ? [appOrigin] : []), ...corsOrigins])
    ),
    rateLimitWindowMs: parsed.RATE_LIMIT_WINDOW_MS,
    rateLimitMax: parsed.RATE_LIMIT_MAX,
  } as const;
}

export const SERVER_ENV = parseServerEnv(process.env);
