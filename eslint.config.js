import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // React
        React: "readonly",
        // Browser/Node globals
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        window: "readonly",
        document: "readonly",
        process: "readonly",
        // Web APIs
        fetch: "readonly",
        Request: "readonly",
        RequestInit: "readonly",
        Response: "readonly",
        Headers: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        FormData: "readonly",
        crypto: "readonly",
        btoa: "readonly",
        atob: "readonly",
        WebSocket: "readonly",
        TextEncoder: "readonly",
        TextDecoder: "readonly",
        // Test globals
        expect: "readonly",
        // Node types
        NodeJS: "readonly",
        // Cloudflare Workers types
        Env: "readonly",
        D1Database: "readonly",
        Queue: "readonly",
        DurableObjectNamespace: "readonly",
        ExecutionContext: "readonly",
        ExportedHandler: "readonly",
        WebSocketPair: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // Enforce import type for TypeScript types
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      // No unused vars allowed
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
  {
    ignores: [
      "build/**",
      "node_modules/**",
      ".react-router/**",
      "dist/**",
      "*.config.js",
      "*.config.ts",
    ],
  },
];
