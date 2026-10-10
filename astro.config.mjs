import { defineConfig } from "astro/config";

// The production origin lives in src/config/site.ts (SITE_URL). Astro only needs
// it for absolute URLs, so it is read from the same place here.
import { BASE_PATH, SITE_URL } from "./src/config/site.ts";

export default defineConfig({
  site: SITE_URL ? new URL(SITE_URL).origin : undefined,
  base: BASE_PATH || undefined,
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
  compressHTML: true,
  devToolbar: { enabled: false },
});
