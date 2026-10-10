import { clamp, docTop, type MotionModule } from "./types";

/**
 * "Explore more around you": the three phones rise into their layout position purely as a
 * function of scroll progress. progress = 1 removes the transform entirely.
 */
export function exploreModule(): MotionModule | null {
  const row = document.querySelector<HTMLElement>("[data-explore-row]");
  const phones = [...document.querySelectorAll<HTMLElement>("[data-explore-phone]")];
  if (!row || phones.length < 3) return null;

  let rowTop = 0;
  let offsets = [0, 0, 0];
  let last = -1;

  return {
    resize() {
      rowTop = docTop(row);
      const phoneHeight = phones[0].querySelector<HTMLElement>(".phone")?.offsetHeight ?? 600;
      const base = phoneHeight * 0.33;
      // Phones 1 and 2 travel the same distance, phone 3 about 1.85x as far.
      offsets = [base, base, base * 1.85];
      last = -1;
    },
    update({ scroll, vh }) {
      const progress = clamp((vh - (rowTop - scroll)) / (vh * 0.9));
      if (progress === last) return;
      last = progress;
      phones.forEach((phone, index) => {
        if (progress >= 1) {
          phone.style.transform = "";
          phone.style.willChange = "";
        } else {
          phone.style.willChange = "transform";
          phone.style.transform = `translate3d(0, ${(offsets[index] * (1 - progress)).toFixed(2)}px, 0)`;
        }
      });
    },
  };
}
