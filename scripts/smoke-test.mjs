// Lightweight smoke test for the four static routes. Run after `npm run build`.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const routes = ["/", "/terms/", "/privacy/", "/support/"];
const titles = {
  "/": "Walk&Sight — Explore More Around You",
  "/terms/": "Walk&Sight — Terms of Service",
  "/privacy/": "Walk&Sight — Privacy Policy",
  "/support/": "Walk&Sight — Support",
};
const failures = [];
const check = (ok, message) => ok || failures.push(message);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

for (const route of routes) {
  const file = join(dist, route, "index.html");
  check(existsSync(file), `${route}: missing ${file}`);
  if (!existsSync(file)) continue;
  const html = readFileSync(file, "utf8");
  check(html.includes(`<title>${titles[route].replace(/&/g, "&amp;")}</title>`), `${route}: wrong <title>`);
  check((html.match(/<h1[\s>]/g) ?? []).length === 1, `${route}: expected exactly one <h1>`);
  if (route === "/") {
    check((html.match(/<header[\s>]/g) ?? []).length === 1, "/: expected exactly one <header> (no duplicate sticky header)");
    check(!/sticky-header/.test(html), "/: leftover sticky-header markup");
  }
  check(/name="description"/.test(html), `${route}: missing meta description`);
  // the current page is plain text in the nav, so it only needs links to the other pages
  for (const href of ["/terms/", "/privacy/", "/support/"].filter((h) => h !== route)) {
    check(html.includes(`href="${href}"`), `${route}: missing link to ${href}`);
  }
  check(!/Rivelo/i.test(html), `${route}: contains "Rivelo"`);
  check(!/shopping list/i.test(html), `${route}: contains shopping-list copy`);
  check(!/figma\.com/.test(html), `${route}: references figma.com`);
  const canonical = `https://www.walknsight.app${route}`;
  check(html.includes(`<link rel="canonical" href="${canonical}">`), `${route}: wrong canonical`);
  check(html.includes(`property="og:url" content="${canonical}"`), `${route}: wrong og:url`);
  check(!new RegExp(["Walk" + "SightPage", "github" + "\\.io"].join("|")).test(html), `${route}: GitHub Pages reference`);
  check(!/localhost:3845/.test(html), `${route}: references the local Figma server`);
}

for (const file of walk(dist).filter((f) => /\.(html|css|js|svg)$/.test(f))) {
  const text = readFileSync(file, "utf8");
  check(!/figma\.com\/api|localhost:3845/.test(text), `${file}: temporary Figma asset URL`);
}

if (failures.length) {
  console.error(`Smoke test failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`Smoke test passed for ${routes.length} routes.`);
