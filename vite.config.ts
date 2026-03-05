import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { cpSync } from "fs";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "copy-assets",
      closeBundle() {
        cpSync(
          resolve(__dirname, "assets"),
          resolve(__dirname, "dist/assets"),
          {
            recursive: true,
          },
        );
      },
      configureServer(server) {
        // Serve /assets/* from the project root assets/ folder during dev
        server.middlewares.use("/assets", (req, res, next) => {
          import("fs").then(({ existsSync, createReadStream }) => {
            const filePath = resolve(__dirname, "assets", req.url!.slice(1));
            if (existsSync(filePath)) {
              createReadStream(filePath).pipe(res);
            } else {
              next();
            }
          });
        });
      },
    },
  ],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
