"use client"

import { useTheme } from "next-themes"
import { Sun, Moon, SunMoon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [eyeComfort, setEyeComfort] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Restore eye comfort from localStorage
    const stored = localStorage.getItem("eye-comfort")
    if (stored === "true") {
      setEyeComfort(true)
      document.documentElement.setAttribute("data-eye-comfort", "true")
    }
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon-sm" aria-label="Toggle theme">
        <Sun className="size-4" />
      </Button>
    )
  }

  const isDark = theme === "dark"

  const cycleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  const toggleEyeComfort = () => {
    const next = !eyeComfort
    setEyeComfort(next)
    localStorage.setItem("eye-comfort", String(next))
    if (next) {
      document.documentElement.setAttribute("data-eye-comfort", "true")
    } else {
      document.documentElement.removeAttribute("data-eye-comfort")
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={cycleTheme}
        aria-label="Toggle theme"
        className="relative overflow-hidden"
      >
        <Sun
          className={`size-4 absolute transition-all duration-300 ${
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`size-4 absolute transition-all duration-300 ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </Button>
      <Button
        variant={eyeComfort ? "secondary" : "ghost"}
        size="icon-sm"
        onClick={toggleEyeComfort}
        aria-label="Toggle eye comfort"
      >
        <SunMoon className={`size-4 transition-colors duration-200 ${eyeComfort ? "text-amber-600" : ""}`} />
      </Button>
    </div>
  )
}
