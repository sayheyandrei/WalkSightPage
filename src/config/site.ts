/**
 * Single source of truth for site-wide values.
 * Every "Download app" control reads APP_STORE_URL from here.
 */

export const SITE_NAME = "WalkSight";

/**
 * Production origin, e.g. "https://example.com" (no trailing slash).
 * Canonical and Open Graph URLs are only emitted once this is set.
 */
export const SITE_URL = "";

/**
 * App Store listing URL. WalkSight has no public App Store ID yet, so this is
 * intentionally empty instead of an invented link. Set it once the listing is
 * live: all "Download app" buttons and the footer QR code follow automatically.
 */
export const APP_STORE_URL = "";

/** Support contact, same verified address the iOS app uses (SupportContact.email). */
export const SUPPORT_EMAIL = "sayheyandrei@gmail.com";

export const LEGAL_LAST_UPDATED = "October 7, 2026";

export const DEFAULT_DESCRIPTION =
  "Discover nearby landmarks, viewpoints, parks, cafés and hidden gems. Build walking routes around your time, distance and interests.";

export const THEME_STORAGE_KEY = "walksight-theme";

export const NAV_LINKS = [
  { href: "/terms/", label: "Terms of Service" },
  { href: "/privacy/", label: "Privacy Policy" },
  { href: "/support/", label: "Support" },
] as const;
