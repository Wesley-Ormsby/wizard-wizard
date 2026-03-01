import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") setTheme("light");
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
    toggle: () =>
      setTheme(t => (t === "dark" ? "light" : "dark")),
  };
}
