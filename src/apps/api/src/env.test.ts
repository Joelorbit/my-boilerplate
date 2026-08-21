import { describe, expect, it } from "vitest";
import { parseServerEnv } from "./env";

describe("parseServerEnv", () => {
  it("normalizes, deduplicates, and combines configured browser origins", () => {
    const env = parseServerEnv({
      NODE_ENV: "production",
      APP_ORIGIN: "https://app.example.com/path",
      CORS_ORIGINS: "https://admin.example.com, https://app.example.com",
      RATE_LIMIT_WINDOW_MS: "60000",
      RATE_LIMIT_MAX: "20",
    });

    expect(env).toMatchObject({
      nodeEnv: "production",
      isProduction: true,
      appOrigin: "https://app.example.com",
      rateLimitWindowMs: 60000,
      rateLimitMax: 20,
    });
    expect(env.allowedOrigins).toEqual([
      "https://app.example.com",
      "https://admin.example.com",
    ]);
  });

  it("uses secure local defaults when no CORS configuration is supplied", () => {
    expect(parseServerEnv({ NODE_ENV: "development" })).toMatchObject({
      isProduction: false,
      allowedOrigins: [],
      rateLimitWindowMs: 900000,
      rateLimitMax: 100,
    });
  });
});
