import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist-lib",
    lib: { entry: "src/system/index.ts", formats: ["es"], fileName: "index" },
    rollupOptions: {
      external: (id) =>
        /^(react|react-dom|@base-ui\/react|lucide-react)(\/|$)/.test(id),
      output: { banner: '"use client";' },
    },
  },
});
