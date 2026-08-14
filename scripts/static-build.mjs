// Assembles a plain static site in ./dist from the prerendered client build.
// Run with: bun run build:static  (or npm run build:static)
import { cp, rm, mkdir, readFile, writeFile, access } from "node:fs/promises";
import { resolve } from "node:path";
import { tmpdir } from "node:os";

const root = resolve(import.meta.dirname, "..");
const src = resolve(root, "dist/client");
const out = resolve(root, "dist");
const staging = resolve(tmpdir(), `static-build-${Date.now()}`);

await access(src).catch(() => {
  console.error("dist/client not found — run the static build first.");
  process.exit(1);
});

// Stage the client output, then replace ./dist with just the static files.
await cp(src, staging, { recursive: true });
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(staging, out, { recursive: true });
await rm(staging, { recursive: true, force: true });

// SPA fallback: unknown URLs still boot the app instead of 404-ing.
const index = await readFile(resolve(out, "index.html"), "utf8");
await writeFile(resolve(out, "404.html"), index);

// Apache rewrite so deep links work on classic hosting.
await writeFile(
  resolve(out, ".htaccess"),
  `Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^ index.html [L]

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
`,
);

console.log("Static site ready in ./dist — upload its contents to your web host.");
