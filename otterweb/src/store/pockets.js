import { createPocket } from "otterpocket";

export const STORAGE_KEY = "otterpocket-site-settings";

export const DEMO_TODOS = [
  { id: 1, label: "Create store", done: true },
  { id: 2, label: "Add filter state", done: false },
  { id: 3, label: "Toggle dark mode", done: false },
];

export function readStoredSettings() {
  if (typeof window === "undefined") {
    return { theme: "river", compact: false, reducedMotion: false };
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    return {
      theme: parsed.theme === "kelp" ? "kelp" : "river",
      compact: Boolean(parsed.compact),
      reducedMotion: Boolean(parsed.reducedMotion),
    };
  } catch {
    return { theme: "river", compact: false, reducedMotion: false };
  }
}

export const pocket = createPocket({
  count: 3,
  todos: DEMO_TODOS,
  todoDraft: "",
  todoFilter: "all",
  darkMode: false,
});

export const settingsPocket = createPocket(readStoredSettings());
