import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  root: "pages",
  base: process.env.BASE_PATH ?? "/anivelaga/",
  publicDir: "../public",
  css: { transformer: "lightningcss" },
  plugins: [tailwindcss(), tsconfigPaths({ projects: ["../tsconfig.json"] }), react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  build: {
    outDir: "../dist-pages",
    emptyOutDir: true,
  },
});
