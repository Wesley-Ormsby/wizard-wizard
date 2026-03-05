import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") setTheme("light");

    const widowTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    };
    widowTheme.addEventListener("change", handleThemeChange);

    return () => widowTheme.removeEventListener("change", handleThemeChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);

    const sync = (e: StorageEvent) => {
      if (e.key === "theme") {
        setTheme((e.newValue as "dark" | "light") ?? "dark");
      }
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [theme]);

  return {
    theme,
    toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };
}
