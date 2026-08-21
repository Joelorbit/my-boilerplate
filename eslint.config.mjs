import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/",
      "node_modules/",
      "drizzle/*.sql",
      ".manus-logs/",
      "src/apps/web/public/__manus__/**",
      "src/apps/web/src/components/ui/**",
      "src/apps/web/src/components/ManusDialog.tsx",
      "src/apps/web/src/_core/**",
      "src/apps/web/src/contexts/**",
      "src/apps/web/src/hooks/**",
      "src/apps/api/src/_core/**",
      "src/apps/api/src/storage.ts",
      "vite.config.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/apps/web/src/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ["src/apps/api/src/**/*.ts", "src/packages/**/*.ts"],
    languageOptions: { globals: globals.node },
  },
  prettier
);
