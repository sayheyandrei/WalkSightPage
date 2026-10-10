import { THEME_STORAGE_KEY } from "../config/site";

type Theme = "light" | "dark";

const META_COLORS: Record<Theme, string> = { light: "#ffffff", dark: "#111111" };

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  document.getElementById("meta-theme-color")?.setAttribute("content", META_COLORS[theme]);
  document.querySelectorAll<HTMLButtonElement>("[data-theme-set]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeSet === theme));
  });
}

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function initTheme() {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const current = (document.documentElement.getAttribute("data-theme") as Theme) || "light";
  applyTheme(current);

  document.querySelectorAll<HTMLButtonElement>("[data-theme-set]").forEach((button) => {
    button.addEventListener("click", () => {
      const next: Theme = button.dataset.themeSet === "dark" ? "dark" : "light";
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* storage can be unavailable (private mode): the choice still applies for this page */
      }
      applyTheme(next);
    });
  });

  // Follow the system setting until the visitor makes an explicit choice.
  media.addEventListener("change", (event) => {
    if (storedTheme()) return;
    applyTheme(event.matches ? "dark" : "light");
  });

  // Keep several open tabs in sync.
  window.addEventListener("storage", (event) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    const value = event.newValue;
    if (value === "light" || value === "dark") applyTheme(value);
  });
}
