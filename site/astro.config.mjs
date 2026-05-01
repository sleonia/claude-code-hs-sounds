import { defineConfig } from "astro/config";
import { resolve } from "node:path";
import fs from "node:fs";
import path from "node:path";

const soundpackDir = resolve(import.meta.dirname, "../soundpack");

function soundpackServe() {
  return {
    name: "serve-soundpack",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/soundpack/")) return next();

        const relativePath = req.url.slice("/soundpack/".length);
        const filePath = path.join(
          soundpackDir,
          decodeURIComponent(relativePath),
        );

        if (!filePath.startsWith(soundpackDir)) {
          res.statusCode = 403;
          res.end("Forbidden");
          return;
        }

        fs.stat(filePath, (err, stat) => {
          if (err || !stat.isFile()) {
            res.statusCode = 404;
            res.end("Not found");
            return;
          }
          const ext = path.extname(filePath).toLowerCase();
          const mimeTypes = {
            ".wav": "audio/wav",
            ".mp3": "audio/mpeg",
            ".ogg": "audio/ogg",
          };
          res.setHeader(
            "Content-Type",
            mimeTypes[ext] || "application/octet-stream",
          );
          res.setHeader("Content-Length", stat.size);
          fs.createReadStream(filePath).pipe(res);
        });
      });
    },
  };
}

export default defineConfig({
  base: "/ai-harness-hs-sounds/",
  vite: {
    plugins: [soundpackServe()],
  },
});
