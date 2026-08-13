// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// `bun run build:static` sets STATIC_BUILD=1 to produce a plain static site
// (HTML + assets) you can upload to any classic web host.
const isStatic = process.env["STATIC_BUILD"] === "1";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(isStatic
      ? {
          prerender: { enabled: true, crawlLinks: true },
          pages: [
            { path: "/", prerender: { enabled: true } },
            { path: "/conditions", prerender: { enabled: true } },
            { path: "/confidentialite", prerender: { enabled: true } },
            { path: "/leads", prerender: { enabled: true } },
            { path: "/visitors", prerender: { enabled: true } },
          ],
        }
      : {}),
  },
  ...(isStatic ? { nitro: { preset: "static" } } : {}),
});
