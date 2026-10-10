# True 2x raster export from Figma

The Figma MCP connectors only render 1x, so the website's raster assets were exported at 1x.
This folder re-exports the original nodes at a real `SCALE 2` constraint through a local Figma
development plugin (`exportAsync`), then crops them exactly like the existing assets.

1. `node tools/figma-2x-export/server.mjs` (listens on `localhost:8765`, writes to `./out`)
2. Figma desktop, file "Walk Sight": Plugins > Development > Import plugin from manifest... >
   `tools/figma-2x-export/manifest.json`, then run **WalkSight 2x export**
3. `node tools/figma-2x-export/process.mjs` — rewrites `src/assets/{phones,cards,pins}` (same crops, 2x pixels)
4. `npm run build`

The device bezel (`phones/bezel.png`) is an embedded 732x1024 bitmap in Figma, so it cannot be
exported at a higher resolution than its source.
