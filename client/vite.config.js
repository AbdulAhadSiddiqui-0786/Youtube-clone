// client/vite.config.js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env   = loadEnv(mode, process.cwd());
  const isDev = mode === "development";

  return {
    plugins: [react(),tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: isDev ? "http://localhost:10000" : env.VITE_API_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
