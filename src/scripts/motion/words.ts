import { clamp, layoutTop, type MotionModule } from "./types";

const WINDOW = 0.3; // each word fades in over 30% of the block's progress; keep in sync with motion.css

interface Group {
  el: HTMLElement;
  heading: HTMLElement;
  top: number;
  last: number;
}

/**
 * Description text reveals word by word, linked to scroll through its heading:
 * heading top at the viewport bottom -> progress 0; heading top at the viewport top -> progress 1.
 * The visual words are aria-hidden; the full sentence stays available once as visually hidden text.
 */
export function wordsModule(): MotionModule | null {
  const groups: Group[] = [];

  document.querySelectorAll<HTMLElement>("[data-words]").forEach((el) => {
    const heading = el.parentElement?.querySelector<HTMLElement>("h1, h2, h3");
    if (!heading) {
      el.classList.add("words-ready");
      return;
    }
    const full = (el.textContent ?? "").replace(/\s+/g, " ").trim();
    const words: HTMLElement[] = [];
    const visual = document.createElement("span");
    visual.className = "words";
    visual.setAttribute("aria-hidden", "true");
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        (node.textContent ?? "").split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            visual.append(" ");
          } else {
            const span = document.createElement("span");
            span.className = "w";
            span.textContent = part;
            words.push(span);
            visual.append(span);
          }
        });
      } else {
        visual.append(node.cloneNode(true));
      }
    });
    const spoken = document.createElement("span");
    spoken.className = "visually-hidden";
    spoken.textContent = full;
    el.replaceChildren(visual, spoken);
    words.forEach((span, index) => span.style.setProperty("--s", ((index / words.length) * (1 - WINDOW)).toFixed(4)));
    el.style.setProperty("--p", "0");
    el.classList.add("words-ready");
    groups.push({ el, heading, top: 0, last: -1 });
  });

  if (!groups.length) return null;

  return {
    resize() {
      groups.forEach((group) => {
        group.top = layoutTop(group.heading);
        group.last = -1;
      });
    },
    update({ scroll, vh }) {
      for (const group of groups) {
        const progress = Math.round(clamp((vh - (group.top - scroll)) / vh) * 1000) / 1000;
        if (progress === group.last) continue;
        group.last = progress;
        group.el.style.setProperty("--p", String(progress));
      }
    },
  };
}
