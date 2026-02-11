"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSyncExternalStore, useState, useCallback } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [eyeComfort, setEyeComfort] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("eye-comfort");
    if (stored === "true") {
      document.documentElement.setAttribute("data-eye-comfort", "true");
      return true;
    }
    return false;
  });

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon-sm" aria-label="Toggle theme">
        <Sun className="size-4" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  const cycleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const toggleEyeComfort = () => {
    const next = !eyeComfort;
    setEyeComfort(next);
    localStorage.setItem("eye-comfort", String(next));
    if (next) {
      document.documentElement.setAttribute("data-eye-comfort", "true");
    } else {
      document.documentElement.removeAttribute("data-eye-comfort");
    }
  };

  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={cycleTheme}
        aria-label="Toggle theme"
        className="relative overflow-hidden size-7 sm:size-8"
      >
        <Sun
          className={`size-3.5 sm:size-4 absolute transition-all duration-300 ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`size-3.5 sm:size-4 absolute transition-all duration-300 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </Button>
      <Button
        variant={eyeComfort ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={toggleEyeComfort}
        aria-label="Toggle eye comfort"
        className="hidden xs:inline-flex size-7 sm:size-8"
      >
        <SunMoon
          className={`size-3.5 sm:size-4 transition-colors duration-200 ${eyeComfort ? "text-amber-600" : ""}`}
        />
      </Button>
    </div>
  );
}
