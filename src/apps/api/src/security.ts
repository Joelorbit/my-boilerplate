import type { Request, RequestHandler, Response } from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { randomUUID } from "node:crypto";
import { SERVER_ENV } from "./env";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function requestOrigin(req: Request): string | undefined {
  const host = req.get("host");
  if (!host) return undefined;

  const forwardedProto = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto || req.protocol;
  return `${protocol}://${host}`;
}

function isConfiguredOrigin(origin: string): boolean {
  return SERVER_ENV.allowedOrigins.includes(origin);
}

function isTrustedOrigin(req: Request, origin: string): boolean {
  const currentOrigin = requestOrigin(req);
  return origin === currentOrigin || isConfiguredOrigin(origin);
}

export function isCrossSiteUnsafeRequest(
  req: Pick<Request, "method" | "get">
): boolean {
  if (SAFE_METHODS.has(req.method.toUpperCase())) return false;

  const fetchSite = req.get("sec-fetch-site");
  if (fetchSite === "cross-site" || fetchSite === "same-site") return true;

  return false;
}

export const requestId: RequestHandler = (req, res, next) => {
  const incoming = req.get("x-request-id");
  const id =
    incoming && /^[a-zA-Z0-9_-]{8,128}$/.test(incoming)
      ? incoming
      : randomUUID();

  res.locals.requestId = id;
  res.setHeader("x-request-id", id);
  next();
};

export const corsAllowlist: RequestHandler = (req, res, next) => {
  const origin = req.get("origin");
  if (!origin) return next();

  res.vary("Origin");
  if (!isTrustedOrigin(req, origin)) {
    if (req.method === "OPTIONS") {
      res.status(403).json({ error: "Origin is not allowed." });
      return;
    }
    return next();
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Request-Id"
  );
  res.setHeader("Access-Control-Max-Age", "600");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
};

export const csrfGuard: RequestHandler = (req, res, next) => {
  if (SAFE_METHODS.has(req.method.toUpperCase())) return next();

  res.vary("Origin");
  res.vary("Sec-Fetch-Site");

  if (isCrossSiteUnsafeRequest(req)) {
    res
      .status(403)
      .json({ error: "Cross-site state-changing requests are not accepted." });
    return;
  }

  const origin = req.get("origin");
  if (origin && !isTrustedOrigin(req, origin)) {
    res.status(403).json({ error: "Request origin is not trusted." });
    return;
  }

  next();
};

export function applySecurityMiddleware(
  applyGlobal: (handler: RequestHandler) => unknown,
  applyApiRateLimit: (handler: RequestHandler) => unknown
) {
  applyGlobal(requestId);
  applyGlobal(
    helmet({
      contentSecurityPolicy: SERVER_ENV.isProduction
        ? {
            directives: {
              defaultSrc: ["'self'"],
              baseUri: ["'self'"],
              fontSrc: ["'self'", "https:", "data:"],
              frameAncestors: ["'none'"],
              imgSrc: ["'self'", "data:", "https:"],
              objectSrc: ["'none'"],
              scriptSrc: ["'self'", "'unsafe-inline'"],
              styleSrc: ["'self'", "'unsafe-inline'", "https:"],
            },
          }
        : false,
      crossOriginEmbedderPolicy: false,
    })
  );
  applyGlobal(corsAllowlist);
  applyGlobal(csrfGuard);
  applyApiRateLimit(
    rateLimit({
      windowMs: SERVER_ENV.rateLimitWindowMs,
      limit: SERVER_ENV.rateLimitMax,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: { error: "Too many requests. Please try again shortly." },
    })
  );
}

export function logServerError(error: unknown, req: Request, res: Response) {
  const requestId = res.locals.requestId ?? "unknown";
  const message =
    error instanceof Error ? error.message : "Unknown server error";
  console.error(
    `[Server] requestId=${requestId} method=${req.method} path=${req.path} error=${message}`
  );
}
