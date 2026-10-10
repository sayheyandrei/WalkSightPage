import { clamp, docTop, type MotionModule } from "./types";

/**
 * "Explore more around you": the three phones rise into their layout position purely as a
 * function of scroll progress. progress = 1 removes the transform entirely.
 */
/** Scroll-progress windows: phone 1 starts first, phone 2 follows, phone 3 starts last and ends last. */
const WINDOWS: Array<[number, number]> = [
  [0, 0.45],
  [0.16, 0.65],
  [0.32, 1],
];

export function exploreModule(): MotionModule | null {
  const row = document.querySelector<HTMLElement>("[data-explore-row]");
  const phones = [...document.querySelectorAll<HTMLElement>("[data-explore-phone]")];
  if (!row || phones.length < 3) return null;

  let refTop = 0;
  let offsets = [0, 0, 0];
  let last = -1;
  const mobile = window.matchMedia("(max-width: 767.98px)");

  return {
    resize() {
      if (mobile.matches) {
        // Mobile uses the swipe gallery (see initGallery); the vertical rise is not used there.
        phones.forEach((phone) => {
          phone.style.transform = "";
          phone.style.willChange = "";
        });
        last = -1;
        return;
      }
      const phoneHeight = phones[0].querySelector<HTMLElement>(".phone")?.offsetHeight ?? 600;
      // phones 1 and 2 sit 40% of a phone height below the row top; use their top as reference
      refTop = docTop(row) + phoneHeight * 0.4;
      const base = phoneHeight * 0.33;
      // Phones 1 and 2 travel the same distance, phone 3 about 1.85x as far.
      offsets = [base, base, base * 1.85];
      last = -1;
    },
    update({ scroll, vh }) {
      if (mobile.matches) return;
      const progress = Math.round(clamp((vh - (refTop - scroll)) / (vh * 0.95)) * 1000) / 1000;
      if (progress === last) return;
      last = progress;
      phones.forEach((phone, index) => {
        const [from, to] = WINDOWS[index];
        const q = clamp((progress - from) / (to - from));
        if (q >= 1) {
          phone.style.transform = "";
          phone.style.willChange = "";
        } else {
          phone.style.willChange = "transform";
          phone.style.transform = `translate3d(0, ${(offsets[index] * (1 - q)).toFixed(2)}px, 0)`;
        }
      });
    },
  };
}

/**
 * Mobile swipe gallery: the row is a native scroll-snap container. Start with the middle phone
 * centred (until the visitor touches it). Works with and without motion preferences.
 */
export function initGallery() {
  const row = document.querySelector<HTMLElement>("[data-explore-row]");
  const phones = [...document.querySelectorAll<HTMLElement>("[data-explore-phone]")];
  if (!row || phones.length < 3) return;
  const mobile = window.matchMedia("(max-width: 767.98px)");
  let touched = false;
  row.addEventListener("pointerdown", () => (touched = true), { passive: true });
  const centre = () => {
    if (!mobile.matches || touched) return;
    const ordered = [...phones].sort((a, b) => a.offsetLeft - b.offsetLeft);
    const middle = ordered[Math.floor(ordered.length / 2)];
    row.scrollLeft = middle.offsetLeft - (row.clientWidth - middle.offsetWidth) / 2;
  };
  centre();
  window.addEventListener("load", centre);
  window.addEventListener("resize", centre, { passive: true });
  mobile.addEventListener("change", centre);
}
