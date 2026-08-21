import { describe, expect, it } from "vitest";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

const authenticatedUser: NonNullable<TrpcContext["user"]> = {
  id: 42,
  openId: "integration-user",
  email: "integration@example.com",
  name: "Integration User",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

function context(user: TrpcContext["user"]): TrpcContext {
  return {
    user,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("application router integration", () => {
  it("exposes the authenticated identity through the public auth procedure", async () => {
    const caller = appRouter.createCaller(context(authenticatedUser));

    await expect(caller.auth.me()).resolves.toEqual(authenticatedUser);
  });

  it("rejects profile access when the request has no authenticated user", async () => {
    const caller = appRouter.createCaller(context(null));

    await expect(caller.profile.get()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});
