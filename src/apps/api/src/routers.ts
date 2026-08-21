import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  getProfileForUser,
  getDb,
  listRecentAuditEventsForUser,
  recordAuditEvent,
  upsertProfile,
} from "./db";
import { SERVER_ENV } from "./env";

const profileInput = z.object({
  displayName: z.string().trim().min(1).max(120).optional(),
  timezone: z.string().trim().min(1).max(64),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  bootstrap: router({
    status: protectedProcedure.query(async ({ ctx }) => {
      const profile = await getProfileForUser(ctx.user.id);

      return {
        user: {
          id: ctx.user.id,
          role: ctx.user.role,
          name: ctx.user.name,
          email: ctx.user.email,
        },
        profile,
        runtime: {
          databaseConfigured: Boolean(await getDb()),
          sameOriginDefault: true,
          explicitCorsOrigins: SERVER_ENV.allowedOrigins.length,
          environment: SERVER_ENV.nodeEnv,
        },
      };
    }),
  }),
  profile: router({
    get: protectedProcedure.query(({ ctx }) => getProfileForUser(ctx.user.id)),
    update: protectedProcedure
      .input(profileInput)
      .mutation(async ({ ctx, input }) => {
        const profile = await upsertProfile(ctx.user.id, input);
        await recordAuditEvent({
          actorUserId: ctx.user.id,
          action: "profile.updated",
          targetType: "profile",
          targetId: String(ctx.user.id),
        });
        return profile;
      }),
  }),
  audit: router({
    recent: protectedProcedure.query(({ ctx }) =>
      listRecentAuditEventsForUser(ctx.user.id)
    ),
  }),
});

export type AppRouter = typeof appRouter;
