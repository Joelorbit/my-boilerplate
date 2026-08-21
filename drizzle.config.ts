import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: "./src/packages/database/src/schema.ts",
  out: "./src/packages/database/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
  },
});
