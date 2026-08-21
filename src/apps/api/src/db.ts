import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { auditEvents, type InsertUser, profiles, users } from "@db/schema";
import { ENV } from "./_core/env";

let database: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!database && process.env.DATABASE_URL) {
    try {
      database = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Connection initialization failed.", error);
      database = null;
    }
  }
  return database;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for an upsert.");

  const db = await getDb();
  if (!db) return;

  const values: InsertUser = {
    openId: user.openId,
    lastSignedIn: user.lastSignedIn ?? new Date(),
  };
  const updateSet: Record<string, unknown> = {
    lastSignedIn: values.lastSignedIn,
  };

  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }

  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  await db
    .insert(users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return result[0];
}

export async function getProfileForUser(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);
  return result[0];
}

export async function upsertProfile(
  userId: number,
  input: { displayName?: string; timezone: string }
) {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable.");

  await db
    .insert(profiles)
    .values({
      userId,
      displayName: input.displayName,
      timezone: input.timezone,
    })
    .onDuplicateKeyUpdate({
      set: {
        displayName: input.displayName,
        timezone: input.timezone,
        updatedAt: new Date(),
      },
    });

  return getProfileForUser(userId);
}

export async function recordAuditEvent(input: {
  actorUserId?: number;
  action: string;
  targetType: string;
  targetId?: string;
  detail?: string;
}) {
  const db = await getDb();
  if (!db) return;

  await db.insert(auditEvents).values(input);
}

export async function listRecentAuditEventsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(auditEvents)
    .where(eq(auditEvents.actorUserId, userId))
    .orderBy(desc(auditEvents.createdAt), desc(auditEvents.id))
    .limit(20);
}
