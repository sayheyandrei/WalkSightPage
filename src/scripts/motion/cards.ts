import { clamp, docTop, type MotionModule } from "./types";

interface Art {
  el: HTMLElement;
  card: HTMLElement;
  /** The edge the artwork is cropped by, i.e. the edge it slides in from. */
  from: "down" | "right";
  cardTop: number;
  distance: number;
  last: number;
}

/**
 * Feature-card artwork slides in from the edge that currently crops it (card stays still):
 *  - Follow your route: bottom       - Know your route: right
 *  - See how much you've explored: right   - Discover every place: bottom
 * Progress 1 = Figma position, transform removed.
 */
export function cardsModule(): MotionModule | null {
  const arts: Art[] = [...document.querySelectorAll<HTMLElement>("[data-card-art]")].flatMap((el) => {
    const card = el.closest<HTMLElement>(".card");
    return card ? [{ el, card, from: el.dataset.cardArt === "right" ? ("right" as const) : ("down" as const), cardTop: 0, distance: 0, last: -1 }] : [];
  });
  if (!arts.length) return null;

  return {
    resize() {
      for (const art of arts) {
        art.cardTop = docTop(art.card);
        // the largest part of the artwork that can slide away while a good part stays visible
        art.distance = art.from === "right" ? art.el.offsetWidth * 0.42 : art.el.offsetHeight * 0.3;
        art.last = -1;
      }
    },
    update({ scroll, vh }) {
      for (const art of arts) {
        const progress = Math.round(clamp((vh - (art.cardTop - scroll)) / (vh * 0.6)) * 1000) / 1000;
        if (progress === art.last) continue;
        art.last = progress;
        if (progress >= 1) {
          art.el.style.transform = "";
          art.el.style.willChange = "";
          continue;
        }
        const offset = (art.distance * (1 - progress)).toFixed(2);
        art.el.style.willChange = "transform";
        art.el.style.transform = art.from === "right" ? `translate3d(${offset}px, 0, 0)` : `translate3d(0, ${offset}px, 0)`;
      }
    },
  };
}
