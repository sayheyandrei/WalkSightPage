/**
 * Raster artwork exported from the Figma file (phone screens, app cards, map
 * pins). Astro converts these to optimised WebP at build time.
 */
import type { ImageMetadata } from "astro";

import bezel from "../assets/phones/bezel.png";
import island from "../assets/phones/island.png";

import lightHero from "../assets/phones/light-hero.png";
import lightPlace from "../assets/phones/light-place.png";
import lightPlanner from "../assets/phones/light-planner.png";
import lightRoute from "../assets/phones/light-route.png";
import lightNearby from "../assets/phones/light-nearby.png";
import darkHero from "../assets/phones/dark-hero.png";
import darkPlace from "../assets/phones/dark-place.png";
import darkPlanner from "../assets/phones/dark-planner.png";
import darkRoute from "../assets/phones/dark-route.png";
import darkNearby from "../assets/phones/dark-nearby.png";

import lightCardRoute from "../assets/cards/light-route.png";
import lightCardStop from "../assets/cards/light-stop.png";
import lightCardStopD from "../assets/cards/light-d-stop.png";
import lightCardStats from "../assets/cards/light-stats.png";
import lightCardStatsD from "../assets/cards/light-d-stats.png";
import lightCardPlace from "../assets/cards/light-place.png";
import darkCardRoute from "../assets/cards/dark-route.png";
import darkCardStop from "../assets/cards/dark-stop.png";
import darkCardStats from "../assets/cards/dark-stats.png";
import darkCardPlace from "../assets/cards/dark-place.png";

import lightPin1 from "../assets/pins/light-1.png";
import lightPin2 from "../assets/pins/light-2.png";
import lightPin3 from "../assets/pins/light-3.png";
import lightPin4 from "../assets/pins/light-4.png";
import lightPin5 from "../assets/pins/light-5.png";
import lightPin6 from "../assets/pins/light-6.png";
import lightPin7 from "../assets/pins/light-7.png";
import darkPin1 from "../assets/pins/dark-1.png";
import darkPin2 from "../assets/pins/dark-2.png";
import darkPin3 from "../assets/pins/dark-3.png";
import darkPin4 from "../assets/pins/dark-4.png";
import darkPin5 from "../assets/pins/dark-5.png";
import darkPin6 from "../assets/pins/dark-6.png";
import darkPin7 from "../assets/pins/dark-7.png";

export interface ThemedImage {
  light: ImageMetadata;
  dark: ImageMetadata;
}

export const phoneParts = { bezel, island };

export const screens = {
  hero: { light: lightHero, dark: darkHero },
  place: { light: lightPlace, dark: darkPlace },
  planner: { light: lightPlanner, dark: darkPlanner },
  route: { light: lightRoute, dark: darkRoute },
  nearby: { light: lightNearby, dark: darkNearby },
} satisfies Record<string, ThemedImage>;

export const cards = {
  route: { light: lightCardRoute, dark: darkCardRoute },
  // The light theme has a second export from the 1440 frame that shows more of
  // the card, because the design crops these cards at the right edge.
  stop: { light: lightCardStop, lightD: lightCardStopD, dark: darkCardStop },
  stats: { light: lightCardStats, lightD: lightCardStatsD, dark: darkCardStats },
  place: { light: lightCardPlace, dark: darkCardPlace },
};

export const pins = {
  light: [lightPin1, lightPin2, lightPin3, lightPin4, lightPin5, lightPin6, lightPin7],
  dark: [darkPin1, darkPin2, darkPin3, darkPin4, darkPin5, darkPin6, darkPin7],
};
