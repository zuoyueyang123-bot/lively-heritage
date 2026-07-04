"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * Theme toggle: switches between "ink" (深色水墨赛博) and "paper" (浅色宣纸国风).
 * Persists choice in localStorage.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"ink" | "paper">("ink");

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const saved = localStorage.getItem("feiyi-theme");
      if (saved === "paper" || saved === "ink") {
        setTheme(saved);
        document.documentElement.setAttribute("data-theme", saved === "paper" ? "paper" : "");
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  function toggle() {
    const next = theme === "ink" ? "paper" : "ink";
    setTheme(next);
    localStorage.setItem("feiyi-theme", next);
    document.documentElement.setAttribute("data-theme", next === "paper" ? "paper" : "");
  }

  return (
    <button
      onClick={toggle}
      className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] transition hover:bg-[var(--glass-bg)]"
      aria-label={theme === "ink" ? "切换到宣纸模式" : "切换到水墨模式"}
      title={theme === "ink" ? "宣纸模式" : "水墨模式"}
    >
      {theme === "ink" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
