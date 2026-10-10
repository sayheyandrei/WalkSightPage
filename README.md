# WalkSight website

Static marketing site for WalkSight (Astro, TypeScript, plain CSS). Routes: `/`, `/terms/`, `/privacy/`, `/support/`.

```bash
npm install
npm run dev      # local development
npm run build    # static output in dist/
npm test         # route smoke test (run after build)
```

## Configuration — `src/config/site.ts`

- `APP_STORE_URL` — every "Download app" button and the footer QR code read it. **Empty until the App Store listing exists** (no ID is invented). While empty, buttons link to `#` and the QR encodes a plain-text note.
- `SITE_URL` — production origin; canonical and Open Graph URLs are emitted once set.
- `SUPPORT_EMAIL` — contact address used on the legal/support pages.

## Design implementation notes

- Figma is the source of truth (reference frames 375 / 1440 / 1920). Layout metrics are CSS custom properties in `src/styles/tokens.css`; desktop sizes interpolate between the 1440 and 1920 values.
- Light/dark colours are semantic tokens. The theme is stored in `localStorage` and applied by an inline script before first paint.
- Phone screens and app cards are exported Figma renders in `src/assets` (optimised to WebP by Astro); vector artwork is in `public/assets/svg`.
