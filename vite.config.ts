import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

const plugins = [react(), tailwindcss(), jsxLocPlugin()];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    envDir: path.resolve(import.meta.dirname),
    root: path.resolve(import.meta.dirname, "client"),
    publicDir: path.resolve(import.meta.dirname, "client", "public"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
              return "vendor-react";
            }
            if (id.includes("node_modules/@clerk/react") || id.includes("node_modules/@clerk/shared")) {
              return "vendor-clerk";
            }
            if (id.includes("node_modules/lucide-react") || id.includes("node_modules/framer-motion")) {
              return "vendor-ui";
            }
            if (
              id.includes("node_modules/@trpc/client") ||
              id.includes("node_modules/@trpc/react-query") ||
              id.includes("node_modules/@tanstack/react-query")
            ) {
              return "vendor-trpc";
            }
            return undefined;
          },
        },
      },
    },
    server: {
      host: true,
      allowedHosts: [
        "allsquared.io",
        "www.allsquared.io",
        "app.allsquared.io",
        "localhost",
        "127.0.0.1",
      ],
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
    define: {
      __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE || 'AllSquared'),
    },
  };
});
