// Turns the raw 2x exports in ./out into the website's raster assets (same crops as the
// existing 1x files). Usage: node tools/figma-2x-export/process.mjs [outDir=src/assets]
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const inDir = path.join(here, "out");
const outRoot = path.resolve(process.argv[2] ?? path.join(root, "src/assets"));

// [export name, destination, crop in 1x node pixels (null = whole node)]
const jobs = [];
for (const theme of ["light", "dark"]) {
  for (const n of ["hero", "place", "planner", "route", "nearby"]) jobs.push([`${theme}-${n}`, `phones/${theme}-${n}.png`, null, "screen"]);
  jobs.push([`card-${theme}-route`, `cards/${theme}-route.png`, { top: 0, height: 887 }]);
  jobs.push([`card-${theme}-stop`, `cards/${theme}-stop.png`, { width: 491, height: 184 }]);
  jobs.push([`card-${theme}-stats`, `cards/${theme}-stats.png`, { width: 491, height: 195 }]);
  jobs.push([`card-${theme}-place`, `cards/${theme}-place.png`, { height: 491 }]);
  for (let i = 1; i <= 7; i++) jobs.push([`pin-${theme}-${i}`, `pins/${theme}-${i}.png`, null]);
}
jobs.push(["card-light-d-stop", "cards/light-d-stop.png", { width: 379, height: 138 }]);
jobs.push(["card-light-d-stats", "cards/light-d-stats.png", { width: 379, height: 140 }]);
jobs.push(["card-light-m-place", "cards/light-m-place.png", { height: 348 }]);

// Dynamic island is a separate Figma layer above the screen; composite it back (fractions of the screen).
const ISLAND = { left: 0.33842, top: 0.01473, width: 0.32314, height: 0.043426 };
const island = path.join(root, "src/assets/phones/island.png");

for (const [name, dest, crop, kind] of jobs) {
  const file = path.join(inDir, `${name}.png`);
  if (!fs.existsSync(file)) { console.warn("missing export:", name); continue; }
  let image = sharp(file);
  const meta = await image.metadata();
  const scale = 2;
  if (crop) {
    const width = Math.min(meta.width, Math.round((crop.width ?? meta.width / scale) * scale));
    const height = Math.min(meta.height, Math.round((crop.height ?? meta.height / scale) * scale));
    image = sharp(await image.extract({ left: 0, top: crop.top ? crop.top * scale : 0, width, height }).toBuffer());
  }
  let buffer = await image.png().toBuffer();
  if (kind === "screen") {
    const w = meta.width, h = meta.height;
    const iw = Math.round(w * ISLAND.width), ih = Math.round(h * ISLAND.height);
    const overlay = await sharp(island).resize(iw, ih).toBuffer();
    buffer = await sharp(buffer).composite([{ input: overlay, left: Math.round(w * ISLAND.left), top: Math.round(h * ISLAND.top) }]).png().toBuffer();
  }
  const target = path.join(outRoot, dest);
  const before = fs.existsSync(target) ? await sharp(target).metadata() : null;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, buffer);
  const after = await sharp(buffer).metadata();
  console.log(`${dest}: ${before ? `${before.width}x${before.height}` : "-"} -> ${after.width}x${after.height}`);
}
