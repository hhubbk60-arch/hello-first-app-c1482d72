// Assembles a plain static site in ./static from the prerendered client build.
// Run with: bun run build:static
import { cp, rm, mkdir, readFile, writeFile, access } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const src = resolve(root, "dist/client");
const out = resolve(root, "static");

await access(src).catch(() => {
  console.error("dist/client not found — run the static build first.");
  process.exit(1);
});

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(src, out, { recursive: true });

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

console.log("Static site ready in ./static — upload its contents to your web host.");
