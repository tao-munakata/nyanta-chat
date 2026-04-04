import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // server-only はvitestのjsdom環境で動作しないためモックに差し替え
      "server-only": path.resolve(__dirname, "__mocks__/server-only.ts"),
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
