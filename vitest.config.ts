import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  root: templateRoot,
  resolve: {
    alias: {
      "@": path.resolve(templateRoot, "src", "apps", "web", "src"),
      "@shared": path.resolve(templateRoot, "src", "packages", "shared", "src"),
      "@db": path.resolve(templateRoot, "src", "packages", "database", "src"),
      "@assets": path.resolve(templateRoot, "attached_assets"),
    },
  },
  test: {
    environment: "node",
    include: ["src/apps/api/src/**/*.test.ts", "src/apps/api/src/**/*.spec.ts"],
  },
});
